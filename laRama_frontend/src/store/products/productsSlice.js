import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productsAPI from '../../api/graphql/products.API';

export const loadProducts = createAsyncThunk('products/load', async () => {
  const products = await productsAPI.fetchProducts();
  return products;
});

export const addProduct = createAsyncThunk('products/add', async (input) => {
  const product = await productsAPI.createProduct(input);
  return product;
});

export const editProduct = createAsyncThunk('products/edit', async (input) => {
  const product = await productsAPI.updateProduct(input);
  return product;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  const res = await productsAPI.removeProduct(id);
  return res;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(editProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload.id);
      });
  },
});

export default productsSlice.reducer;
