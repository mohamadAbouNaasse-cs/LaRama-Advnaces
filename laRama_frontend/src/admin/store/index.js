import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';

export const createAdminStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
    },
  });

export default createAdminStore;
