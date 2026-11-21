/* ============================================================
   Урон, нокаут, болевой порог
   ============================================================ */

function showDamage(){
	hideMap();
	if(!character.exists){
		showOutput(`<h2>Нет персонажа</h2><div class="msg bad">Сначала создайте персонажа.</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}
	const koInfo = character.knockout_stage > 0
		? `<div class="msg warn">Стадия нокаута: ${character.knockout_stage}. При следующем нокауте штраф ${10 * (character.knockout_stage + 1)} ХП.</div>`
		: '';

	showOutput(`
		<h2>Урон</h2>
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="row"><span class="k">Жетоны</span><span class="v">${character.tokens}/5</span></div>
		<div class="row"><span class="k">Стадия нокаута</span><span class="v">${character.knockout_stage}</span></div>
		${koInfo}
		<div class="field">
			<label>Значение урона</label>
			<input type="number" id="damageAmount" min="1" value="10" inputmode="numeric">
		</div>
		<div class="field">
			<label>Уязвимость / сопротивление</label>
			<select id="damageModifier">
				<option value="1">Нет (×1)</option>
				<option value="2">Уязвимость (×2)</option>
				<option value="0.5">Сопротивление (×0.5)</option>
			</select>
		</div>
		<button class="btn blood" onclick="applyDamage()">Применить урон</button>
		<div class="duo">
			<button class="btn blood" onclick="applyKnockoutDamage()">Урон по нокауту</button>
			<button class="btn moss" onclick="applyPlayerHeal()">Лечение от игрока</button>
		</div>
		<button class="btn ghost" onclick="showMainMenu()">← Назад</button>
	`);
}

function applyDamage(){
	const dmg = parseInt($('damageAmount').value, 10) || 0;
	const mod = parseFloat($('damageModifier').value) || 1;
	if(dmg <= 0){
		showOutput(`<h2>Ошибка</h2><div class="msg bad">Введите положительное число.</div>
			<button class="btn ghost" onclick="showDamage()">← Назад</button>`);
		return;
	}
	const actualDamage = Math.floor(dmg * mod);
	const message = processDamage(actualDamage);
	saveCharacter();

	const pct = character.maxHp > 0 ? clamp(character.hp / character.maxHp * 100, 0, 100) : 0;
	showOutput(`<h2>Результат</h2>${message}
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${Math.max(0, character.hp)}/${character.maxHp}</span></div>
		<div class="bar"><i style="width:${pct}%"></i><span>${Math.round(pct)}%</span></div>
		<div class="row"><span class="k">Жетоны</span><span class="v">${character.tokens}/5</span></div>
		<div class="row"><span class="k">Стадия нокаута</span><span class="v">${character.knockout_stage}</span></div>
		<button class="btn ghost" onclick="showDamage()">← К урону</button>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>`);
}

/* ИСПРАВЛЕНИЕ БАГА: смерть проверяется ДО выдачи/сброса жетонов,
   чтобы воскрешение не «перекрывало» смерть. */
function processDamage(actualDamage){
	let message = `<div class="msg warn">Получено урона: ${actualDamage}.</div>`;
	const painThreshold = Math.floor(character.maxHp / 2) + character.endurance * 5;

	character.hp -= actualDamage;

	if(actualDamage >= painThreshold){
		const check = d(20) + character.stars.hp;
		if(check < 15){
			const effect = d(4);
			message += `<div class="msg bad">Болевой порог превышен. Проверка ${check} &lt; 15, d4=${effect}.</div>`;
			if(effect === 1) message += `<div class="msg warn">Оглушение на ход.</div>`;
			else if(effect === 2) message += `<div class="msg warn">Паника, пропуск хода.</div>`;
			else if(effect === 3) message += `<div class="msg warn">Удар по случайной цели, попытка скрыться.</div>`;
			else message += `<div class="msg warn">Защитная стойка.</div>`;
		}else{
			message += `<div class="msg ok">Болевой порог превышен, но проверка пройдена (${check} ≥ 15).</div>`;
		}
	}

	if(character.hp <= 0){
		character.knockout_stage += 1;
		const penalty = 10 * character.knockout_stage;
		character.hp -= penalty;
		message += `<div class="msg bad">Нокаут. Стадия ${character.knockout_stage}, штраф ${penalty} ХП (10 × ${character.knockout_stage}).</div>`;

		if(character.hp <= -character.maxHp){
			message += `<div class="msg bad">Персонаж мёртв.</div>`;
			return message;
		}

		character.tokens = Math.min(5, character.tokens + 1);
		message += `<div class="msg warn">Жетон нокаута: ${character.tokens}/5.</div>`;

		if(character.tokens >= 5){
			const revived = Math.round(character.maxHp * 0.1);
			character.hp = revived;
			character.tokens = 0;
			message += `<div class="msg ok">5 жетонов — возврат в бой с ${revived} ХП. Стадия нокаута сохраняется (${character.knockout_stage}).</div>`;
		}
	}

	return message;
}