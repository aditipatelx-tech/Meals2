const KEY = 'meal-roulette-state';

export const loadState = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { theme: 'light' };
  } catch {
    return { theme: 'light' };
  }
};

export const saveState = (state) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};
