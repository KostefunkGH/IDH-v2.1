/* ============================================================
   Справка
   ============================================================ */

function showHelp(){
	hideMap();
	showOutput(`
		<h2>Справка</h2>
		<h3>Главное меню</h3>
		<div class="row"><span class="k">Характеристики</span><span class="v">лист персонажа</span></div>
		<div class="row"><span class="k">Кубики</span><span class="v">генератор dN</span></div>
		<div class="row"><span class="k">Уровень</span><span class="v">опыт и прокачка</span></div>
		<div class="row"><span class="k">Урон</span><span class="v">урон, добивание, помощь</span></div>
		<div class="row"><span class="k">Лечение</span><span class="v">восстановление ХП</span></div>
		<div class="row"><span class="k">Описание</span><span class="v">личная заметка</span></div>
		<div class="row"><span class="k">Долгий отдых</span><span class="v">сброс нокаута и удачи</span></div>
		<div class="row"><span class="k">Карта</span><span class="v">карта мира</span></div>
		<h3>Нокаут</h3>
		<div class="row"><span class="k">Стадия</span><span class="v">+1 за нокаут</span></div>
		<div class="row"><span class="k">Штраф</span><span class="v">10 × стадия</span></div>
		<div class="row"><span class="k">Сброс стадии</span><span class="v">только отдых</span></div>
		<div class="row"><span class="k">Жетоны</span><span class="v">5 → возврат с 10% ХП</span></div>
		<div class="row"><span class="k">Добивание</span><span class="v">10 × стадия, +1 жетон</span></div>
		<div class="row"><span class="k">Помощь</span><span class="v">+1 жетон, без урона</span></div>
		<p class="tip">Данные сохраняются в браузере. 15 звёзд: −5…+5 в характеристику; за каждые 2 отрицательные +1 доступная положительная.</p>
		<button class="btn ghost" onclick="showMainMenu()">← Назад</button>
	`);
}