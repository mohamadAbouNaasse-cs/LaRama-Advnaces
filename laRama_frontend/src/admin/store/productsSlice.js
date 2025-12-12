import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsGraphQL } from '../services/graphqlClient';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const products = await fetchProductsGraphQL();
  return products.map((p) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    description: p.description,
  }));
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
