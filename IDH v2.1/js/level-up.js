/* ============================================================
   Опыт и повышение уровня
   ============================================================ */

function showLevelUp(){
	hideMap();
	if(!character.exists){
		showOutput(`<h2>Нет персонажа</h2><div class="msg bad">Сначала создайте персонажа.</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}
	if(character.hp <= 0){
		showOutput(`<h2>Невозможно</h2><div class="msg bad">Персонаж в нокауте. Сначала восстановите здоровье.</div>
			<button class="btn ghost" onclick="showMainMenu()">← Назад</button>`);
		return;
	}
	showOutput(`
		<h2>Повышение опыта</h2>
		<div class="row"><span class="k">Опыт</span><span class="v exp">${character.exp}/${character.expToNext}</span></div>
		<div class="row"><span class="k">Уровень</span><span class="v">${character.level}</span></div>
		<div class="field">
			<label>Сколько опыта добавить</label>
			<input type="number" id="expAdd" min="1" value="10" inputmode="numeric">
		</div>
		<button class="btn" onclick="addExperience()">Добавить</button>
		<button class="btn ghost" onclick="showMainMenu()">← Назад</button>
	`);
}

function addExperience(){
	const expAdd = parseInt($('expAdd').value, 10) || 0;
	if(expAdd <= 0){
		showOutput(`<h2>Ошибка</h2><div class="msg bad">Введите положительное число.</div>
			<button class="btn ghost" onclick="showLevelUp()">← Назад</button>`);
		return;
	}

	character.exp += expAdd;
	let leveledUp = false;
	while(character.exp >= character.expToNext){
		character.level += 1;
		character.exp -= character.expToNext;
		character.expToNext += 20;
		leveledUp = true;
	}
	saveCharacter();

	let message = `<div class="msg ok">Добавлено ${expAdd} опыта.</div>`;
	if(leveledUp){
		message += `
			<div class="msg warn">Новый уровень: ${character.level}!</div>
			<h3>Выберите характеристику</h3>
			<div class="menu">
				<button onclick="upgradeStat(1)">ХП +20</button>
				<button onclick="upgradeStat(2)">Сила +5</button>
				<button onclick="upgradeStat(3)">Скорость +1</button>
				<button onclick="upgradeStat(4)">Интеллект +20</button>
				<button onclick="upgradeStat(5)">Выносливость +2</button>
				<button onclick="upgradeStat(6)">Харизма +1</button>
			</div>`;
	}

	showOutput(`<h2>Результат</h2>${message}
		<div class="row"><span class="k">Уровень</span><span class="v">${character.level}</span></div>
		<div class="row"><span class="k">Опыт</span><span class="v exp">${character.exp}/${character.expToNext}</span></div>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>`);
}

function upgradeStat(choice){
	switch(choice){
		case 1: character.hp += 20; character.maxHp += 20; character.stars.hp += 1; break;
		case 2: character.strength += 5; character.stars.strength += 1; break;
		case 3: character.speed += 1; character.stars.speed += 1; break;
		case 4: character.intelligence += 20; character.stars.intelligence += 1; break;
		case 5: character.endurance += 2; character.stars.endurance += 1; break;
		case 6: character.charisma += 1; character.stars.charisma += 1; break;
	}
	saveCharacter();
	showCharacterSheet();
}