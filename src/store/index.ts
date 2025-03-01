import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './slices/notesSlice';
import categoriesReducer from './slices/categoriesSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('notes');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    categories: categoriesReducer
  },
  preloadedState: {
    notes: loadState() || { notes: [], loading: false, error: null }
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;