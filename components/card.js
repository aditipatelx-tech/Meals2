import { el } from '../utils/dom.js';

export function createCard(meal, onOpen) {
  const card = el('article', { className: 'card recipe-card', tabindex: '0', role: 'button', 'aria-label': `Open ${meal.name}` });
  card.dataset.name = meal.name;

  card.append(
    el('div', { className: 'topline' }, [
      el('h3', { className: 'title', text: meal.name })
    ]),
    el('div', { className: 'meta' }, [
      el('span', { className: 'tag accent', text: meal.cuisine }),
      el('span', { className: `tag ${meal.diet === 'Veg' ? 'green' : 'orange'}`, text: meal.diet }),
      el('span', { className: 'tag', text: meal.time })
    ]),
    el('p', { className: 'desc', text: meal.desc })
  );

  const open = () => onOpen(meal.name);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });

  return card;
}
