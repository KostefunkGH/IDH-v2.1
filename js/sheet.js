/* ============================================================
   Лист персонажа
   ============================================================ */

function showCharacterSheet(){
	hideMap();
	if(!character.exists){
		showOutput(`<h2>Нет персонажа</h2><p>Создайте персонажа.</p>
			<button class="btn" onclick="showCreateCharacter()">Создать</button>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}

	const hpPct = character.maxHp > 0 ? clamp(character.hp / character.maxHp * 100, 0, 100) : 0;
	const xpPct = character.expToNext > 0 ? clamp(character.exp / character.expToNext * 100, 0, 100) : 0;
	const pain = Math.floor(character.maxHp / 2) + character.endurance * 5;
	const noteHtml = character.note
		? `<div class="note"><b>Заметка:</b><br>${esc(character.note)}</div>`
		: '';

	showOutput(`
		<h2>Характеристики</h2>
		<div class="row"><span class="k">Класс</span><span class="v">${esc(character.className)}</span></div>
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="bar"><i style="width:${hpPct}%"></i><span>${Math.round(hpPct)}%</span></div>
		<div class="row"><span class="k">Сила</span><span class="v">${character.strength}</span></div>
		<div class="row"><span class="k">Скорость</span><span class="v">${character.speed} (±${character.speed} к d20)</span></div>
		<div class="row"><span class="k">Интеллект (мана)</span><span class="v">${character.intelligence}</span></div>
		<div class="row"><span class="k">Выносливость</span><span class="v">${character.endurance} (+${character.endurance*5} к порогу)</span></div>
		<div class="row"><span class="k">Харизма</span><span class="v">${character.charisma}</span></div>
		<div class="row"><span class="k">Болевой порог</span><span class="v">${pain}</span></div>
		<h3>Уровень и опыт</h3>
		<div class="row"><span class="k">Уровень</span><span class="v">${character.level}</span></div>
		<div class="row"><span class="k">Опыт</span><span class="v exp">${character.exp}/${character.expToNext}</span></div>
		<div class="bar xp"><i style="width:${xpPct}%"></i><span>${Math.round(xpPct)}%</span></div>
		<div class="row"><span class="k">Жетоны нокаута</span><span class="v">${character.tokens}/5</span></div>
		<div class="row"><span class="k">Стадия нокаута</span><span class="v">${character.knockout_stage}</span></div>
		<div class="row"><span class="k">Удача</span><span class="v">${character.luck_available ? 'доступна' : 'использована'}</span></div>
		${noteHtml}
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>
	`);
}