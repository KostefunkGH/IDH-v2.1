/* ============================================================
   Загрузка карты мира (Вариант 3)
   Карта хранится в localStorage как data-URL.
   Инициализируется из init.js — порядок гарантирован.
   ============================================================ */
(function(){
	const KEY = 'starwalkerMapImage';

	let input, resetBtn, statusEl, img;
	let inited = false;

	function $(id){ return document.getElementById(id); }

	function setStatus(text, kind){
		if(!statusEl) return;
		statusEl.textContent = text || '';
		statusEl.className = 'tip' + (kind ? ' ' + kind : '');
	}

	function applyDataUrl(dataUrl){
		if(!img) return;
		img.src = dataUrl;
	}

	function loadSaved(){
		let dataUrl = null;
		try{ dataUrl = localStorage.getItem(KEY); }catch(e){}
		if(!dataUrl){
			setStatus('Карта не загружена. Выберите файл изображения.', '');
			return false;
		}
		applyDataUrl(dataUrl);
		setStatus('Карта загружена из сохранения.', 'ok');
		return true;
	}

	function saveDataUrl(dataUrl){
		try{
			localStorage.setItem(KEY, dataUrl);
			return true;
		}catch(e){
			setStatus('Не удалось сохранить карту: ' + (e && e.message ? e.message : 'ошибка localStorage'), 'bad');
			return false;
		}
	}

	function handleFile(file){
		if(!file) return;
		if(!file.type || !file.type.startsWith('image/')){
			setStatus('Это не изображение. Выберите файл картинки.', 'bad');
			return;
		}
		if(file.size > 3.5 * 1024 * 1024){
			if(!confirm('Файл больше 3.5 МБ. Он может не поместиться в localStorage. Продолжить?')) return;
		}
		const fr = new FileReader();
		fr.onload = ()=>{
			const dataUrl = String(fr.result || '');
			if(!dataUrl.startsWith('data:image/')){
				setStatus('Не удалось прочитать изображение.', 'bad');
				return;
			}
			const saved = saveDataUrl(dataUrl);
			applyDataUrl(dataUrl);
			setStatus(
				saved ? 'Карта загружена и сохранена.' : 'Карта загружена, но не сохранена.',
				saved ? 'ok' : 'bad'
			);
		};
		fr.onerror = ()=> setStatus('Ошибка чтения файла.', 'bad');
		fr.readAsDataURL(file);
	}

	function reset(){
		try{ localStorage.removeItem(KEY); }catch(e){}
		if(img) img.removeAttribute('src');
		if(window.MapController && typeof window.MapController.onMapCleared === 'function'){
			window.MapController.onMapCleared();
		}
		setStatus('Карта сброшена. Выберите файл изображения.', '');
		if(input) input.value = '';
	}

	function init(){
		if(inited) return;
		input    = $('mapUpload');
		resetBtn = $('mapResetBtn');
		statusEl = $('mapUploadStatus');
		img      = $('mapImage');
		if(!img) return;

		inited = true;

		img.addEventListener('error', ()=>{
			if(img.getAttribute('src')){
				setStatus('Не удалось отобразить карту. Попробуйте другой файл.', 'bad');
			}
		});

		if(input){
			input.addEventListener('change', e=>{
				const file = e.target.files && e.target.files[0];
				handleFile(file);
			});
		}
		if(resetBtn){
			resetBtn.addEventListener('click', e=>{
				e.preventDefault();
				reset();
			});
		}

		loadSaved();
	}

	window.MapLoader = { init, reset, loadSaved };
})();