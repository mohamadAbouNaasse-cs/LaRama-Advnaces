const GRAPHQL_ENDPOINT = 'http://localhost:3001/graphql';

export async function fetchProductsGraphQL() {
  const query = `
    query {
      products {
        id
        name
        price
        description
      }
    }
  `;

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json.data?.products || [];
}

export default {
  fetchProductsGraphQL,
};
