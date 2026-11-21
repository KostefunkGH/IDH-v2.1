/* ============================================================
   Карта: zoom / pan / pinch + маркеры
   ============================================================ */
(function(){
	const MARKER_KEY = 'starwalkerMapMarkers';
	const MODE_KEY   = 'starwalkerMapMode';

	let viewport, stage, img, markersLayer;
	let scale = 1, tx = 0, ty = 0;
	let minScale = 0.3, maxScale = 6;
	let naturalW = 1, naturalH = 1;
	let inited = false;

	const pointers = new Map();
	let lastPinchDist = 0;
	let dragStart = null;

	let markers = [];
	let mode = 'view'; // 'view' | 'add'
	let pendingPoint = null;
	let draggedMarker = null;
	let markerStart = null;

	function $(id){ return document.getElementById(id); }
	function clamp(v,a,b){ return Math.min(b, Math.max(a, v)); }
	function esc(s){
		return String(s).replace(/[&<>"']/g, c=>({
			'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
		}[c]));
	}

	/* ---------- Маркеры: хранилище ---------- */
	function loadMarkers(){
		try{
			const raw = localStorage.getItem(MARKER_KEY);
			markers = raw ? JSON.parse(raw) : [];
			if(!Array.isArray(markers)) markers = [];
		}catch(e){ markers = []; }
	}
	function saveMarkers(){
		try{ localStorage.setItem(MARKER_KEY, JSON.stringify(markers)); }catch(e){}
	}
	function loadMode(){
		const m = localStorage.getItem(MODE_KEY);
		if(m === 'add' || m === 'view') mode = m;
	}
	function saveMode(){
		try{ localStorage.setItem(MODE_KEY, mode); }catch(e){}
	}

	/* ---------- Трансформация ---------- */
	function applyTransform(){
		if(!stage) return;
		stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
	}
	function clampPan(){
		if(!viewport) return;
		const vw = viewport.clientWidth;
		const vh = viewport.clientHeight;
		const w = naturalW * scale;
		const h = naturalH * scale;
		tx = (w <= vw) ? (vw - w) / 2 : clamp(tx, vw - w, 0);
		ty = (h <= vh) ? (vh - h) / 2 : clamp(ty, vh - h, 0);
	}
	function zoomAt(factor, clientX, clientY){
		if(!viewport) return;
		const rect = viewport.getBoundingClientRect();
		const px = clientX - rect.left;
		const py = clientY - rect.top;
		const newScale = clamp(scale * factor, minScale, maxScale);
		if(newScale === scale) return;
		tx = px - (px - tx) * (newScale / scale);
		ty = py - (py - ty) * (newScale / scale);
		scale = newScale;
		clampPan();
		applyTransform();
	}
	function zoomIn(){
		const r = viewport.getBoundingClientRect();
		zoomAt(1.25, r.left + r.width/2, r.top + r.height/2);
	}
	function zoomOut(){
		const r = viewport.getBoundingClientRect();
		zoomAt(1/1.25, r.left + r.width/2, r.top + r.height/2);
	}
	function reset(){
		scale = 1; tx = 0; ty = 0;
		clampPan();
		applyTransform();
	}
	function fitInitial(){
		if(!viewport || !naturalW || !naturalH) return;
		const vw = viewport.clientWidth;
		const vh = viewport.clientHeight;
		scale = Math.min(vw / naturalW, vh / naturalH, 1);
		minScale = Math.min(scale * 0.5, 0.3);
		tx = (vw - naturalW * scale) / 2;
		ty = (vh - naturalH * scale) / 2;
		applyTransform();
	}
	function screenToPercent(clientX, clientY){
		const rect = viewport.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		const sx = (x - tx) / scale;
		const sy = (y - ty) / scale;
		return {
			x: clamp(sx / naturalW * 100, 0, 100),
			y: clamp(sy / naturalH * 100, 0, 100)
		};
	}

	/* ---------- Рендер маркеров ---------- */
	function renderMarkers(){
		if(!markersLayer) return;
		markersLayer.innerHTML = '';
		markers.forEach(m=>{
			const el = document.createElement('div');
			el.className = 'map-marker';
			el.style.left = m.x + '%';
			el.style.top = m.y + '%';
			el.dataset.id = m.id;
			el.innerHTML = `<div class="pin ${m.color || 'gold'}"></div>` +
				(m.label ? `<div class="lbl">${esc(m.label)}</div>` : '');
			el.addEventListener('pointerdown', e=>onMarkerPointerDown(e, m));
			el.addEventListener('click', e=>{
				e.stopPropagation();
				if(mode === 'view'){
					if(confirm(`Удалить маркер «${m.label || 'без названия'}»?`)){
						removeMarker(m.id);
					}
				}
			});
			markersLayer.appendChild(el);
		});
	}

	function onMarkerPointerDown(e, m){
		if(mode !== 'view') return;
		e.stopPropagation();
		draggedMarker = m;
		markerStart = { x: e.clientX, y: e.clientY, mx: m.x, my: m.y };
		try{ e.target.setPointerCapture(e.pointerId); }catch(err){}
	}
	function moveDraggedMarker(e){
		if(!draggedMarker || !markerStart) return;
		const dx = (e.clientX - markerStart.x) / scale;
		const dy = (e.clientY - markerStart.y) / scale;
		draggedMarker.x = clamp(markerStart.mx + dx / naturalW * 100, 0, 100);
		draggedMarker.y = clamp(markerStart.my + dy / naturalH * 100, 0, 100);
		renderMarkers();
	}
	function endMarkerDrag(){
		if(draggedMarker) saveMarkers();
		draggedMarker = null;
		markerStart = null;
	}

	function addMarker(x, y, label, color){
		markers.push({
			id: Date.now() + '_' + Math.random().toString(36).slice(2,7),
			x, y, label, color
		});
		saveMarkers();
		renderMarkers();
	}
	function removeMarker(id){
		markers = markers.filter(m=>m.id !== id);
		saveMarkers();
		renderMarkers();
	}
	function clearAll(){
		if(!markers.length){ alert('Маркеров нет.'); return; }
		if(confirm('Удалить все маркеры?')){
			markers = [];
			saveMarkers();
			renderMarkers();
		}
	}

	/* ---------- Режим добавления ---------- */
	function setMode(newMode){
		mode = newMode;
		saveMode();
		const btn = $('map-mode-toggle');
		if(btn) btn.textContent = mode === 'add' ? 'Отменить добавление' : 'Добавить маркер';
		if(viewport) viewport.style.cursor = mode === 'add' ? 'crosshair' : 'grab';
		if(mode !== 'add') cancelAdd();
	}
	function toggleMode(){ setMode(mode === 'add' ? 'view' : 'add'); }
	function cancelAdd(){
		pendingPoint = null;
		const form = $('mapMarkerForm');
		if(form) form.style.display = 'none';
	}
	function confirmAdd(){
		if(!pendingPoint){ cancelAdd(); return; }
		const label = ($('markerLabel') && $('markerLabel').value || '').trim();
		const color = ($('markerColor') && $('markerColor').value) || 'gold';
		addMarker(pendingPoint.x, pendingPoint.y, label, color);
		cancelAdd();
	}

	/* ---------- Карта: загрузка/сброс ---------- */
	function onImgLoad(){
		if(!img || !img.naturalWidth || !img.naturalHeight) return;
		naturalW = img.naturalWidth;
		naturalH = img.naturalHeight;
		stage.style.width  = naturalW + 'px';
		stage.style.height = naturalH + 'px';
		stage.style.visibility = 'visible';
		fitInitial();
		renderMarkers();
		setMode(mode);
	}
	function onImgError(){
		if(stage) stage.style.visibility = 'hidden';
	}

	/* ---------- Инициализация ---------- */
	function init(){
		if(inited) return;
		viewport     = $('mapViewport');
		stage        = $('mapStage');
		img          = $('mapImage');
		markersLayer = $('mapMarkers');
		if(!viewport || !stage || !img || !markersLayer) return;

		inited = true;
		loadMarkers();
		loadMode();

		stage.style.visibility = 'hidden';
		img.addEventListener('load', onImgLoad);
		img.addEventListener('error', onImgError);
		if(img.complete && img.naturalWidth) onImgLoad();

		/* --- Wheel zoom (десктоп) --- */
		viewport.addEventListener('wheel', e=>{
			e.preventDefault();
			const factor = e.deltaY < 0 ? 1.15 : 1/1.15;
			zoomAt(factor, e.clientX, e.clientY);
		}, { passive: false });

		/* --- Pointer: pan + pinch + добавление --- */
		viewport.addEventListener('pointerdown', e=>{
			// Режим добавления маркера
			if(mode === 'add'){
				pendingPoint = screenToPercent(e.clientX, e.clientY);
				const form = $('mapMarkerForm');
				if(form) form.style.display = 'block';
				const lbl = $('markerLabel');
				if(lbl){ lbl.value = ''; lbl.focus(); }
				return;
			}

			// Захват указателя, чтобы drag не терялся за пределами viewport
			try{ viewport.setPointerCapture(e.pointerId); }catch(err){}

			pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

			if(pointers.size === 1){
				dragStart = { x: e.clientX, y: e.clientY, tx, ty };
				viewport.classList.add('dragging');
			} else if(pointers.size === 2){
				const pts = Array.from(pointers.values());
				lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
			}
		});

		viewport.addEventListener('pointermove', e=>{
			if(draggedMarker){ moveDraggedMarker(e); return; }

			if(pointers.has(e.pointerId)){
				pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
			}

			if(pointers.size === 2){
				const pts = Array.from(pointers.values());
				const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
				if(lastPinchDist > 0){
					const factor = dist / lastPinchDist;
					const cx = (pts[0].x + pts[1].x) / 2;
					const cy = (pts[0].y + pts[1].y) / 2;
					zoomAt(factor, cx, cy);
				}
				lastPinchDist = dist;
				return;
			}

			if(dragStart && pointers.size === 1){
				tx = dragStart.tx + (e.clientX - dragStart.x);
				ty = dragStart.ty + (e.clientY - dragStart.y);
				clampPan();
				applyTransform();
			}
		});

		function endPointer(e){
			pointers.delete(e.pointerId);
			if(pointers.size < 2) lastPinchDist = 0;
			if(pointers.size === 0){
				dragStart = null;
				viewport.classList.remove('dragging');
			}
			endMarkerDrag();
		}
		viewport.addEventListener('pointerup', endPointer);
		viewport.addEventListener('pointercancel', endPointer);
		viewport.addEventListener('lostpointercapture', endPointer);

		window.addEventListener('resize', ()=>{
			clampPan();
			applyTransform();
		});
	}

	/* ---------- Публичный API ---------- */
	window.MapController = {
		init,
		zoomIn, zoomOut, reset,
		refresh(){
			if(!viewport || !stage || !img) return;
			if(img.naturalWidth){
				naturalW = img.naturalWidth;
				naturalH = img.naturalHeight;
				stage.style.width  = naturalW + 'px';
				stage.style.height = naturalH + 'px';
				stage.style.visibility = 'visible';
			}
			clampPan();
			applyTransform();
			renderMarkers();
		},
		onMapCleared(){
			naturalW = 1; naturalH = 1;
			scale = 1; tx = 0; ty = 0;
			if(stage) stage.style.visibility = 'hidden';
			if(markersLayer) markersLayer.innerHTML = '';
			applyTransform();
		}
	};

	window.MarkerManager = {
		toggleMode, confirmAdd, cancelAdd, clearAll,
		init
	};
})();