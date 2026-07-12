import { qs, el } from '../utils/dom.js';

export function mountModal() {
  const modal = qs('#modal');
  const title = qs('#modalTitle');
  const meta = qs('#modalMeta');
  const desc = qs('#modalDescription');
  const quick = qs('#modalQuick');
  const ingredients = qs('#modalIngredients');
  const steps = qs('#modalSteps');
  const close = qs('#closeModal');

  const open = (meal) => {
    title.textContent = meal.name;
    meta.innerHTML = '';
    quick.innerHTML = '';
    ingredients.innerHTML = '';
    steps.innerHTML = '';

    [meal.cuisine, meal.diet, meal.time, `Serves ${meal.serves}`].forEach((t) => {
      meta.append(el('span', { className: 'tag', text: t }));
    });
    desc.textContent = meal.desc;
    quick.append(
      el('span', { className: 'tag', text: `Ingredients: ${meal.ingredients.length}` }),
      el('span', { className: 'tag', text: `Steps: ${meal.steps.length}` })
    );
    meal.ingredients.forEach((item) => ingredients.append(el('li', { text: item })));
    meal.steps.forEach((item) => steps.append(el('li', { text: item })));
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  return { open, closeModal };
}
