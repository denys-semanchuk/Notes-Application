export const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  localStorage.setItem('notes', JSON.stringify(store.getState().notes));
  return result;
};