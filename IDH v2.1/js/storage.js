/* ============================================================
   Сохранение / загрузка персонажа
   ============================================================ */

function loadCharacter(){
	let saved = null;
	try{ saved = localStorage.getItem(CHAR_KEY); }catch(e){ return false; }
	if(!saved) return false;

	try{
		const data = JSON.parse(saved);
		character = Object.assign(defaultCharacter(), data);

		// Вложенный объект stars
		character.stars = Object.assign(
			{hp:0,strength:0,speed:0,intelligence:0,endurance:0,charisma:0},
			data.stars || {}
		);

		// Нормализация типов
		if(typeof character.note !== 'string') character.note = '';
		if(typeof character.tokens !== 'number') character.tokens = 0;
		if(typeof character.knockout_stage !== 'number') character.knockout_stage = 0;
		if(typeof character.maxHp !== 'number') character.maxHp = 0;
		if(typeof character.level !== 'number') character.level = 1;
		if(typeof character.expToNext !== 'number') character.expToNext = 100;

		// ИСПРАВЛЕНИЕ БАГА: exists только по явному флагу,
		// иначе после удаления персонаж «воскресает» из className.
		character.exists = data.exists === true;

		return character.exists;
	}catch(e){
		return false;
	}
}

function saveCharacter(){
	try{
		localStorage.setItem(CHAR_KEY, JSON.stringify(character));
		return true;
	}catch(e){
		return false;
	}
}