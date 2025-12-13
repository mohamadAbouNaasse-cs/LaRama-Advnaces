import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const GRAPHQL_URL = 'http://localhost:4001/graphql';

const authLink = new ApolloLink((operation, forward) => {
  const adminKey = import.meta.env?.VITE_ADMIN_KEY || '';
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-admin-key': adminKey,
    },
  }));
  return forward(operation);
});

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
