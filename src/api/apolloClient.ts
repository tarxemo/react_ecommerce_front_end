import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Observable } from '@apollo/client/utilities';
import { getAccessToken, getRefreshToken, setAuthToken } from '../utils/auth';
import { REFRESH_TOKEN } from '../api/mutations';

import { ENDPOINT } from '../api/environment';

const httpLink = createHttpLink({
  uri: `${ENDPOINT}/graphql/`, // Correct string interpolation
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

// Error handling and token refresh logic
const errorLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (result) => {
        // Check for token expiry error
        if (result.errors && result.errors.some((err) => err.message === 'Token has expired. Please log in again.')) {
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            // No refresh token available, redirect to login
            window.location.href = '/login';
            observer.complete();
            return;
          }

          // Refresh the token
          fetch(`${ENDPOINT}/graphql/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: REFRESH_TOKEN,
              variables: { refreshToken },
            }),
          })
            .then((res) => res.json())
            .then(({ data }) => {
              if (data?.refreshToken?.accessToken) {
                // Save the new access token
                setAuthToken(data);

                // Update the headers with the new token
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${data.refreshToken.accessToken}`,
                  },
                }));

                // Retry the original request
                const retrySub = forward(operation).subscribe({
                  next: (retryResult) => observer.next(retryResult),
                  error: (retryError) => observer.error(retryError),
                  complete: () => observer.complete(),
                });

                return () => retrySub.unsubscribe();
              } else {
                // Redirect to login if token refresh fails
                window.location.href = '/login';
                observer.complete();
              }
            })
            .catch(() => {
              // Redirect to login if token refresh fails
              window.location.href = '/login';
              observer.complete();
            });
        } else {
          // No token expiry error, pass the result through
          observer.next(result);
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });

    return () => sub.unsubscribe();
  });
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]), // Chain the links
  cache: new InMemoryCache(),
});

export default client;