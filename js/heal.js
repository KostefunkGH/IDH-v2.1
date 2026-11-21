/* ============================================================
   Лечение
   ============================================================ */

function showHeal(){
	hideMap();
	if(!character.exists){
		showOutput(`<h2>Нет персонажа</h2><div class="msg bad">Сначала создайте персонажа.</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}
	if(character.hp >= character.maxHp){
		showOutput(`<h2>Лечение</h2><div class="msg ok">Здоровье уже максимально (${character.hp}/${character.maxHp}).</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}
	showOutput(`
		<h2>Лечение</h2>
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="field">
			<label>Сколько восстановить</label>
			<input type="number" id="healAmount" min="1" value="10" inputmode="numeric">
		</div>
		<button class="btn moss" onclick="applyHeal()">Лечить</button>
		<button class="btn ghost" onclick="showMainMenu()">← Назад</button>
	`);
}

/* ИСПРАВЛЕНИЕ БАГА: жетоны нокаута сбрасываются только при фактическом
   возврате в бой (hp > 0), а не просто при любом лечении. Стадия сохраняется. */
function applyHeal(){
	const heal = parseInt($('healAmount').value, 10) || 0;
	if(heal <= 0){
		showOutput(`<h2>Ошибка</h2><div class="msg bad">Введите положительное число.</div>
			<button class="btn ghost" onclick="showHeal()">← Назад</button>`);
		return;
	}

	const oldHp = character.hp;
	character.hp += heal;
	if(character.hp > character.maxHp) character.hp = character.maxHp;
	const healed = character.hp - oldHp;

	let extra = '';
	if(oldHp <= 0 && character.hp > 0 && character.tokens > 0){
		character.tokens = 0;
		extra = `<div class="msg ok">Персонаж вернулся в бой. Жетоны нокаута сброшены. Стадия сохраняется (${character.knockout_stage}).</div>`;
	}

	saveCharacter();
	const pct = character.maxHp > 0 ? clamp(character.hp / character.maxHp * 100, 0, 100) : 0;
	showOutput(`<h2>Результат лечения</h2>
		<div class="msg ok">Восстановлено ${healed} здоровья.</div>
		${extra}
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="bar"><i style="width:${pct}%;background:repeating-linear-gradient(45deg,#3a7060 0,#3a7060 6px,#4a8a78 6px,#4a8a78 12px)"></i><span>${Math.round(pct)}%</span></div>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>`);
}