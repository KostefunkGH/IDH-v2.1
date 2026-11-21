/* ============================================================
   Навигация и главное меню
   ============================================================ */

function hideMap(){
	const mapSection = $('map-tab-content');
	const output = $('output');
	if(mapSection) mapSection.style.display = 'none';
	if(output) output.style.display = 'block';
}

function showMainMenu(){
	hideMap();

	const noteHtml = character.note
		? `<div class="note"><b>Заметка:</b><br>${esc(character.note)}</div>`
		: '';

	const body = character.exists
		? `
			<div style="margin-top:10px">
				<div class="row"><span class="k">Уровень</span><span class="v">${character.level}</span></div>
				<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
				<div class="row"><span class="k">Опыт</span><span class="v exp">${character.exp}/${character.expToNext}</span></div>
				<div class="row"><span class="k">Жетоны нокаута</span><span class="v">${character.tokens}/5</span></div>
				<div class="row"><span class="k">Стадия нокаута</span><span class="v">${character.knockout_stage}</span></div>
				<div class="row"><span class="k">Удача</span><span class="v">${character.luck_available ? 'доступна' : 'использована'}</span></div>
			</div>
			${noteHtml}
		`
		: '<p class="tip">Создайте персонажа, чтобы начать.</p>';

	showOutput(`
		<h2>Главное меню</h2>
		<p>${character.exists ? 'Персонаж: ' + esc(character.className) : 'Персонаж не создан'}</p>
		${body}
	`);
}