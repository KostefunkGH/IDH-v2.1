/* ============================================================
   Долгий отдых
   ============================================================ */

function showLongRest(){
	hideMap();
	if(!character.exists){
		showOutput(`<h2>Нет персонажа</h2><div class="msg bad">Сначала создайте персонажа.</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}

	character.hp = character.maxHp;
	character.tokens = 0;
	character.knockout_stage = 0;
	character.luck_available = 1;
	saveCharacter();

	showOutput(`
		<h2>Долгий отдых</h2>
		<div class="msg ok">Вы полностью отдохнули.</div>
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="row"><span class="k">Жетоны</span><span class="v">0/5</span></div>
		<div class="row"><span class="k">Стадия нокаута</span><span class="v">0</span></div>
		<div class="row"><span class="k">Удача</span><span class="v">восстановлена</span></div>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>
	`);
}