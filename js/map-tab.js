/* ============================================================
   Вкладка «Карта»
   ============================================================ */

function showMap(){
	const output = $('output');
	const mapSection = $('map-tab-content');
	if(output) output.style.display = 'none';
	if(mapSection) mapSection.style.display = 'block';

	// сообщаем map.js, что вкладка открыта (на случай, если карта
	// не была инициализирована из-за display:none)
	if(window.MapController && typeof window.MapController.refresh === 'function'){
		window.MapController.refresh();
	}
}