import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from '../utils/auth';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/', // Your Django GraphQL Endpoint
});

// Add the JWT token to the headers
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Include the token if available
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain the auth link with the HTTP link
  cache: new InMemoryCache(),
});

export default client;