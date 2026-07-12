import { qs, el } from '../utils/dom.js';

export function mountFilters({ cuisines, diets, onChange }) {
  const cuisineRoot = qs('#cuisineFilters');
  const dietRoot = qs('#dietFilters');
  const state = { cuisine: 'All', diet: 'All' };

  const render = () => {
    cuisineRoot.innerHTML = '';
    dietRoot.innerHTML = '';

    cuisines.forEach((item) => {
      const btn = el('button', {
        type: 'button',
        className: `pill${state.cuisine === item ? ' active' : ''}`,
        text: item,
        onclick: () => {
          state.cuisine = item;
          render();
          onChange({ ...state });
        }
      });
      cuisineRoot.append(btn);
    });

    diets.forEach((item) => {
      const btn = el('button', {
        type: 'button',
        className: `pill${state.diet === item ? ' active' : ''}`,
        text: item,
        onclick: () => {
          state.diet = item;
          render();
          onChange({ ...state });
        }
      });
      dietRoot.append(btn);
    });
  };

  render();
  return { state, render };
}
