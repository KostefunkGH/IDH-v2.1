/* ============================================================
   Удаление персонажа
   ============================================================ */

function deleteCharacter(){
	hideMap();
	if(!character.exists){
		showOutput(`<h2>Удаление</h2><div class="msg warn">Нет персонажа для удаления.</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}
	showOutput(`
		<h2>Удаление персонажа</h2>
		<div class="msg bad">Вы уверены? Данные будут стёрты.</div>
		<button class="btn blood" onclick="confirmDelete()">Да, удалить</button>
		<button class="btn ghost" onclick="showMainMenu()">← Отмена</button>
	`);
}

/* ИСПРАВЛЕНИЕ БАГА: после сброса character.exists = false сохраняем,
   чтобы loadCharacter при перезагрузке не «воскрешал» персонажа. */
function confirmDelete(){
	character = defaultCharacter();
	character.exists = false;
	saveCharacter();
	showOutput(`<h2>Персонаж удалён</h2><div class="msg ok">Лист персонажа очищен.</div>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>`);
}