/* ============================================================
   Создание персонажа
   ============================================================ */

function showCreateCharacter(){
	hideMap();
	showOutput(`
		<h2>Создание персонажа</h2>
		<div class="field">
			<label>Класс</label>
			<select id="classSelect" onchange="updateClassInfo()">
				${Object.keys(CLASSES).map(c=>`<option value="${c}">${c}</option>`).join('')}
			</select>
		</div>
		<div id="classInfo" class="class-info"></div>
		<h3>Распределение звёзд (−5…+5)</h3>
		<div id="starInputs"></div>
		<div id="starsCounter" class="counter"></div>
		<button class="btn" onclick="createCharacter()">Создать</button>
		<button class="btn ghost" onclick="showMainMenu()">← Назад</button>
	`);
	renderStarInputs();
	updateClassInfo();
}

function renderStarInputs(){
	let html = '';
	for(const key of STAT_KEYS){
		html += `<div class="field"><label>${STAT_NAMES[key]}</label>
			<input type="number" id="star_${key}" min="-5" max="5" value="0"
				inputmode="numeric" oninput="updateStarsCounter()"></div>`;
	}
	$('starInputs').innerHTML = html;
	updateStarsCounter();
}

function updateClassInfo(){
	const cls = $('classSelect').value;
	const info = CLASSES[cls];

	const bonusText = Object.entries(info.bonuses)
		.map(([k,v]) => v !== 0 ? `${STAT_NAMES[k] || k} ${v>0?'+':''}${v}` : '')
		.filter(Boolean)
		.join(', ') || 'все по 0';

	$('classInfo').innerHTML =
		`<b>${cls}</b><br>Модификаторы: ${bonusText}<br>Пассивка: ${info.passive}<br>Свободных звёзд: ${info.freeStars}`;

	updateStarsCounter();
}

/* ИСПРАВЛЕНИЕ БАГА: границы ввода учитывают бонусы класса.
   По правилам: если база не 0, диапазон сдвигается (−4…+6 и т.п.). */
function updateStarsCounter(){
	const clsEl = $('classSelect');
	const cls = clsEl ? clsEl.value : 'Авантюрист';
	const freeStars = CLASSES[cls].freeStars;
	const bonuses = CLASSES[cls].bonuses;

	let totalPositive = 0, totalNegative = 0;

	for(const key of STAT_KEYS){
		const el = $('star_' + key);
		if(!el) continue;

		const base = bonuses[key] || 0;
		const minInput = clamp(-5, -5 - base, 5);
		const maxInput = clamp(5, -5 - base, 5 - base);
		el.min = String(minInput);
		el.max = String(maxInput);
		el.title = `Допустимо: ${minInput}…${maxInput}`;

		let v = parseInt(el.value, 10);
		if(isNaN(v)) v = 0;
		if(v > maxInput) v = maxInput;
		if(v < minInput) v = minInput;
		if(String(v) !== el.value) el.value = String(v);

		if(v > 0) totalPositive += v;
		else if(v < 0) totalNegative += Math.abs(v);
	}

	const available = freeStars + Math.floor(totalNegative / 2);
	const counterEl = $('starsCounter');
	if(counterEl){
		counterEl.innerHTML =
			`Положительных: <b>${totalPositive}</b> / доступно <b>${available}</b> · отрицательных: <b>${totalNegative}</b>`;
		counterEl.className = 'counter ' + (totalPositive > available ? 'bad' : 'ok');
	}
}

function createCharacter(){
	const cls = $('classSelect').value;
	const bonuses = CLASSES[cls].bonuses;
	const stars = {};

	for(const key of STAT_KEYS){
		const el = $('star_' + key);
		let v = parseInt(el.value, 10);
		if(isNaN(v)) v = 0;

		const base = bonuses[key] || 0;
		const minInput = clamp(-5, -5 - base, 5);
		const maxInput = clamp(5, -5 - base, 5 - base);

		if(v < minInput || v > maxInput){
			alert(`«${STAT_NAMES[key]}»: допустимо от ${minInput} до ${maxInput} (с учётом класса).`);
			return;
		}
		stars[key] = v;
	}

	let totalPositive = 0, totalNegative = 0;
	for(const k in stars){
		if(stars[k] > 0) totalPositive += stars[k];
		else if(stars[k] < 0) totalNegative += Math.abs(stars[k]);
	}
	const available = CLASSES[cls].freeStars + Math.floor(totalNegative / 2);
	if(totalPositive > available){
		alert(`Превышен лимит: ${totalPositive} > ${available}`);
		return;
	}

	const finalStars = {};
	for(const k of STAT_KEYS) finalStars[k] = stars[k] + (bonuses[k] || 0);

	character = defaultCharacter();
	character.className = cls;
	character.stars = finalStars;

	character.maxHp = 100 + finalStars.hp * 20;
	if(character.maxHp < 1) character.maxHp = 1;
	character.hp = character.maxHp;

	character.strength = 10 + finalStars.strength * 5;
	character.speed = finalStars.speed;
	character.intelligence = 100 + finalStars.intelligence * 20;
	if(character.intelligence < 0) character.intelligence = 0;
	character.endurance = finalStars.endurance;
	character.charisma = finalStars.charisma;

	character.exp = 0;
	character.expToNext = 100;
	character.level = 1;
	character.tokens = 0;
	character.knockout_stage = 0;
	character.luck_available = 1;
	character.note = '';
	character.exists = true;

	saveCharacter();

	showOutput(`
		<h2>Персонаж создан</h2>
		<div class="msg ok">${esc(cls)} сохранён.</div>
		<div class="row"><span class="k">Класс</span><span class="v">${esc(cls)}</span></div>
		<div class="row"><span class="k">Здоровье</span><span class="v hp">${character.hp}/${character.maxHp}</span></div>
		<div class="row"><span class="k">Сила</span><span class="v">${character.strength}</span></div>
		<div class="row"><span class="k">Скорость</span><span class="v">${character.speed}</span></div>
		<div class="row"><span class="k">Интеллект</span><span class="v">${character.intelligence}</span></div>
		<div class="row"><span class="k">Выносливость</span><span class="v">${character.endurance}</span></div>
		<div class="row"><span class="k">Харизма</span><span class="v">${character.charisma}</span></div>
		<div class="row"><span class="k">Уровень</span><span class="v">${character.level}</span></div>
		<button class="btn ghost" onclick="showMainMenu()">← В меню</button>
	`);
}