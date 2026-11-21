/* ============================================================
   Описание персонажа (заметка)
   ============================================================ */

function showDescription(){
	hideMap();
	if(!character.exists){
		showOutput(`<h2>Нет персонажа</h2><div class="msg bad">Сначала создайте персонажа.</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}
	showOutput(`
		<h2>Описание персонажа</h2>
		<p class="tip">Способность, предыстория или заметка. Сохраняется вместе с персонажем.</p>
		<div class="field">
			<label>Заметка</label>
			<textarea id="noteText" placeholder="Например: «Огненный шар» — 3 маны, урон 2d6 по площади...">${esc(character.note || '')}</textarea>
		</div>
		<button class="btn" onclick="saveNote()">Сохранить</button>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>
	`);
}

function saveNote(){
	const el = $('noteText');
	if(!el) return;
	character.note = el.value;
	saveCharacter();
	showOutput(`
		<h2>Описание</h2>
		<div class="msg ok">Заметка сохранена.</div>
		<div class="note">${character.note ? esc(character.note) : '<em>пусто</em>'}</div>
		<div class="field">
			<label>Редактировать</label>
			<textarea id="noteText" placeholder="Введите текст заметки...">${esc(character.note || '')}</textarea>
		</div>
		<button class="btn" onclick="saveNote()">Сохранить</button>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>
	`);
}