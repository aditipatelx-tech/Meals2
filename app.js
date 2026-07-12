import { qs, qsa, el } from './utils/dom.js';
import { loadState, saveState } from './utils/storage.js';
import { createCard } from './components/card.js';
import { mountModal } from './components/modal.js';
import { mountFilters } from './components/filters.js';

const state = loadState();
const ui = {
  search: qs('#searchInput'),
  countText: qs('#countText'),
  statusBox: qs('#statusBox'),
  mealGrid: qs('#mealGrid'),
  rollBtn: qs('#rollBtn'),
  resetBtn: qs('#resetBtn'),
  themeBtn: qs('#themeBtn')
};

const modal = mountModal();

const meals = [
  { name: 'Uttapam', cuisine: 'Indian', diet: 'Veg', time: '25 min', serves: '2', desc: 'Savory rice pancake topped with onion, tomato, and coriander.', ingredients: ['1 cup rice batter', '1/2 cup onion, finely chopped', '1/2 cup tomato, finely chopped', '2 tbsp coriander', '2 tsp oil', 'Salt to taste'], steps: ['Heat a tawa and lightly grease it with oil.', 'Pour a ladle of batter and spread into a medium circle.', 'Top with onion, tomato, and coriander.', 'Cook on medium heat until the base turns golden.', 'Flip once and cook the other side briefly. Serve hot with chutney.'] },
  { name: 'Pav Bhaji', cuisine: 'Indian', diet: 'Veg', time: '40 min', serves: '2', desc: 'Classic street-style mashed vegetable curry served with buttery pav.', ingredients: ['4 pav buns', '2 potatoes', '1 cup mixed vegetables', '3 tomatoes', '2 onions', '2 tbsp butter', 'Pav bhaji masala', 'Salt to taste'], steps: ['Boil potatoes and mixed vegetables until soft. Mash lightly and keep aside.', 'Sauté onion in butter until soft, then add tomatoes and pav bhaji masala.', 'Add the mashed vegetables and cook until thick and well blended.', 'Butter the pav buns and toast them on a pan until golden.', 'Serve bhaji hot with pav, chopped onion, and lemon.'] },
  { name: 'Masala Dosa', cuisine: 'Indian', diet: 'Veg', time: '45 min', serves: '2', desc: 'Crisp dosa stuffed with spiced potato filling.', ingredients: ['Dosa batter', '2 potatoes', '1 onion', 'Mustard seeds', 'Curry leaves', 'Turmeric', 'Oil', 'Salt'], steps: ['Boil potatoes, mash them, and set aside.', 'Make a filling with mustard, curry leaves, onion, turmeric, and salt.', 'Heat a tawa, spread dosa batter thinly, and cook until crisp.', 'Place potato filling in the center and fold.', 'Serve with chutney and sambar.'] }
];

const cuisines = ['All', ...new Set(meals.map(m => m.cuisine))];
const diets = ['All', 'Veg', 'Non-Veg'];
const filters = mountFilters({
  cuisines,
  diets,
  onChange: update
});

function themeApply() {
  document.documentElement.dataset.theme = state.theme || 'light';
  ui.themeBtn.textContent = (state.theme || 'light') === 'light' ? 'Dark mode' : 'Light mode';
}

function filteredMeals() {
  const q = ui.search.value.trim().toLowerCase();
  return meals.filter(m => {
    const text = `${m.name} ${m.cuisine} ${m.diet} ${m.desc} ${m.ingredients.join(' ')} ${m.steps.join(' ')}`.toLowerCase();
    return (filters.state.cuisine === 'All' || m.cuisine === filters.state.cuisine) && (filters.state.diet === 'All' || m.diet === filters.state.diet) && (!q || text.includes(q));
  });
}

function render() {
  const list = filteredMeals();
  ui.mealGrid.innerHTML = '';
  if (!list.length) {
    ui.mealGrid.append(el('div', { className: 'empty', text: 'No recipes found. Try a different filter or search term.' }));
  } else {
    list.forEach(meal => ui.mealGrid.append(createCard(meal, openMeal)));
  }
  ui.countText.textContent = `${list.length} recipe${list.length === 1 ? '' : 's'} visible`;
}

function openMeal(name) {
  const meal = meals.find(m => m.name === name);
  if (!meal) return;
  modal.open(meal);
  qsa('.recipe-card').forEach(card => card.classList.toggle('active', card.dataset.name === meal.name));
  ui.statusBox.textContent = `Opened ${meal.name}`;
}

function update(partial = {}) {
  Object.assign(filters.state, partial);
  render();
  ui.statusBox.textContent = `Cuisine: ${filters.state.cuisine} · Diet: ${filters.state.diet}`;
}

ui.search.addEventListener('input', render);
ui.rollBtn.addEventListener('click', () => {
  const list = filteredMeals();
  if (!list.length) return;
  openMeal(list[Math.floor(Math.random() * list.length)].name);
});
ui.resetBtn.addEventListener('click', () => {
  ui.search.value = '';
  filters.state.cuisine = 'All';
  filters.state.diet = 'All';
  filters.render();
  render();
  ui.statusBox.textContent = 'Showing all recipes.';
});
ui.themeBtn.addEventListener('click', () => {
  state.theme = (state.theme || 'light') === 'light' ? 'dark' : 'light';
  saveState(state);
  themeApply();
});

themeApply();
render();
