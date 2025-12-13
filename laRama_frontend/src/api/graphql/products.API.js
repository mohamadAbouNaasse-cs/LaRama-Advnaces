import client from '../client';
import {
  GET_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  REMOVE_PRODUCT,
} from './products.queries';

export async function fetchProducts() {
  const { data } = await client.query({ query: GET_PRODUCTS, fetchPolicy: 'no-cache' });
  return data?.products || [];
}

export async function createProduct(input) {
  const { data } = await client.mutate({ mutation: CREATE_PRODUCT, variables: { input } });
  return data?.createProduct;
}

export async function updateProduct(input) {
  const { data } = await client.mutate({ mutation: UPDATE_PRODUCT, variables: { input } });
  return data?.updateProduct;
}

export async function removeProduct(id) {
  const { data } = await client.mutate({ mutation: REMOVE_PRODUCT, variables: { id } });
  return data?.removeProduct;
}

export default {
  fetchProducts,
  createProduct,
  updateProduct,
  removeProduct,
};
