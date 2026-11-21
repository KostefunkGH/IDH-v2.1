/* ============================================================
   Старвалкинг — состояние и утилиты
   ============================================================ */

const CHAR_KEY = 'starwalkerCharacter';

const STAT_KEYS = ['hp','strength','speed','intelligence','endurance','charisma'];
const STAT_NAMES = {
	hp:'ХП', strength:'Сила', speed:'Скорость',
	intelligence:'Интеллект', endurance:'Выносливость', charisma:'Харизма'
};

const CLASSES = {
	'Авантюрист':{
		bonuses:{hp:0,strength:0,speed:0,intelligence:0,endurance:0,charisma:0},
		freeStars:15,
		passive:'Удача: раз в день при выпадении 1 на d20 можно перебросить кубик'
	},
	'Тяжеловес':{
		bonuses:{hp:1,strength:1,speed:0,intelligence:-1,endurance:0,charisma:-1},
		freeStars:15,
		passive:'Двуручное оружие в одной руке'
	},
	'Заклинатель':{
		bonuses:{hp:-1,strength:-1,speed:0,intelligence:2,endurance:0,charisma:0},
		freeStars:15,
		passive:'При 19+ на d20 стоимость заклинания маной −10%'
	},
	'Стеклянная пушка':{
		bonuses:{hp:-2,strength:1,speed:1,intelligence:0,endurance:0,charisma:0},
		freeStars:15,
		passive:'Нет'
	}
};

let character = defaultCharacter();

function defaultCharacter(){
	return {
		hp:0, strength:0, speed:0, intelligence:0, endurance:0, charisma:0,
		exp:0, expToNext:100, level:1,
		tokens:0, knockout_stage:0, luck_available:1,
		exists:false,
		className:'Авантюрист',
		stars:{hp:0,strength:0,speed:0,intelligence:0,endurance:0,charisma:0},
		maxHp:0,
		luckUsed:0,
		note:''
	};
}

/* ---------- Утилиты ---------- */
function d(n){ return Math.floor(Math.random()*n)+1; }
function clamp(v,a,b){ return Math.min(b, Math.max(a, v)); }
function esc(s){
	return String(s).replace(/[&<>"']/g, c=>({
		'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
	}[c]));
}
function $(id){ return document.getElementById(id); }
function showOutput(html){
	const el = $('output');
	if(el) el.innerHTML = html;
}