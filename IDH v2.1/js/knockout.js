/* ============================================================
   Добивание в нокауте и лечение от игрока
   ============================================================ */

function applyKnockoutDamage(){
	if(!character.exists){ showDamage(); return; }
	if(character.hp > 0){
		showOutput(`<h2>Не в нокауте</h2><div class="msg bad">Персонаж не в нокауте (ХП: ${character.hp}).</div>
			<button class="btn ghost" onclick="showDamage()">← Назад</button>`);
		return;
	}
	if(character.knockout_stage === 0) character.knockout_stage = 1;
	const penalty = 10 * character.knockout_stage;
	character.hp -= penalty;

	let message = `<div class="msg bad">Урон по нокауту. Стадия ${character.knockout_stage}: −${penalty} ХП (10 × ${character.knockout_stage}).</div>`;

	if(character.hp <= -character.maxHp){
		message += `<div class="msg bad">Персонаж мёртв.</div>`;
		saveCharacter();
		const pct0 = character.maxHp > 0 ? clamp(character.hp / character.maxHp * 100, 0, 100) : 0;
		showOutput(`<h2>Урон по нокауту</h2>${message}
			<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
			<div class="bar"><i style="width:${pct0}%"></i><span>${Math.round(pct0)}%</span></div>
			<div class="row"><span class="k">Жетоны</span><span class="v">${character.tokens}/5</span></div>
			<div class="row"><span class="k">Стадия</span><span class="v">${character.knockout_stage}</span></div>
			<button class="btn ghost" onclick="showDamage()">← К урону</button>
			<button class="btn ghost" onclick="showMainMenu()">← В меню</button>`);
		return;
	}

	character.tokens = Math.min(5, character.tokens + 1);
	message += `<div class="msg warn">Жетон нокаута: ${character.tokens}/5.</div>`;

	if(character.tokens >= 5){
		const revived = Math.round(character.maxHp * 0.1);
		character.hp = revived;
		character.tokens = 0;
		message += `<div class="msg ok">5 жетонов — возврат в бой с ${revived} ХП. Стадия сохраняется (${character.knockout_stage}).</div>`;
	}

	saveCharacter();
	const pct = character.maxHp > 0 ? clamp(character.hp / character.maxHp * 100, 0, 100) : 0;
	showOutput(`<h2>Урон по нокауту</h2>${message}
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="bar"><i style="width:${pct}%"></i><span>${Math.round(pct)}%</span></div>
		<div class="row"><span class="k">Жетоны</span><span class="v">${character.tokens
		<div class="row"><span class="k">Стадия</span><span class="v">${character.knockout_stage}</span></div>
		<button class="btn ghost" onclick="showDamage()">← К урону</button>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>`);
}

function applyPlayerHeal(){
	if(!character.exists){ showDamage(); return; }
	if(character.knockout_stage === 0){
		showOutput(`<h2>Лечение от игрока</h2>
			<div class="msg bad">Персонаж не в нокауте — жетон не начисляется.</div>
			<button class="btn ghost" onclick="showDamage()">← Назад</button>`);
		return;
	}

	character.tokens = Math.min(5, character.tokens + 1);
	let message = `<div class="msg ok">Начислен жетон нокаута: ${character.tokens}/5. ХП не отнимается.</div>`;

	if(character.tokens >= 5){
		const revived = Math.round(character.maxHp * 0.1);
		character.hp = revived;
		character.tokens = 0;
		message += `<div class="msg ok">5 жетонов — возврат в бой с ${revived} ХП. Стадия сохраняется (${character.knockout_stage}).</div>`;
	}

	saveCharacter();
	const pct = character.maxHp > 0 ? clamp(character.hp / character.maxHp * 100, 0, 100) : 0;
	showOutput(`<h2>Лечение от игрока</h2>${message}
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="bar"><i style="width:${pct}%"></i><span>${Math.round(pct)}%</span></div>
		<div class="row"><span class="k">Жетоны</span><span class="v">${character.tokens}/5</span></div>
		<div class="row"><span class="k">Стадия</span><span class="v">${character.knockout_stage}</span></div>
		<button class="btn ghost" onclick="showDamage()">← К урону</button>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>`);
}