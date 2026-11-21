document.addEventListener('DOMContentLoaded', () => {
	loadCharacter();
	showMainMenu();

	if(window.MapLoader && typeof window.MapLoader.init === 'function'){
		window.MapLoader.init();
	}
	if(window.MapController && typeof window.MapController.init === 'function'){
		window.MapController.init();
	}
});