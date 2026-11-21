/* ============================================================
   Кубики
   ============================================================ */

function showDiceRoller(){
	hideMap();
	showOutput(`
		<h2>Кубики</h2>
		<div class="field">
			<label>Граней (2–100)</label>
			<input type="number" id="diceSides" min="2" max="100" value="20" inputmode="numeric">
		</div>
		<button class="btn" onclick="rollDice()">Бросить</button>
		<div id="diceResult" style="margin-top:12px"></div>
		<button class="btn ghost" onclick="showMainMenu()">← Назад</button>
	`);
}

function rollDice(){
	const sides = parseInt($('diceSides').value, 10) || 20;
	const resultEl = $('diceResult');
	if(sides < 2){
		resultEl.innerHTML = `<div class="msg bad">Минимум 2 грани.</div>`;
		return;
	}

	let result = d(sides);
	let luck = '';

	if(sides === 20 && result === 1 && character.exists
		&& character.className === 'Авантюрист' && character.luck_available){
		result = d(20);
		character.luck_available = 0;
		saveCharacter();
		luck = `<div class="msg warn">Удача Авантюриста! Переброс: ${result}</div>`;
	}

	resultEl.innerHTML = `<div class="dice">${result}</div><p class="tip">d${sides} → ${result}</p>${luck}`;
}