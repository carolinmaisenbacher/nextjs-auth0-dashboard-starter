import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  ApolloProvider,
  fetch
} from '@apollo/client';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';

import auth0 from 'lib/auth0';
import introspectionQueryResultData from './fragmentMatcher';
import cleanTypenameLink from './cleanTypenameLink';

let apolloClient = null;

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient || initApolloClient(apolloState, { getToken });
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  if (process.env.NODE_ENV !== 'production') {
    // Find correct display name
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component';

    // Warn if old way of installing apollo is used
    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    // Set correct display name for devtools
    WithApollo.displayName = `withApollo(${displayName})`;

    // Add some prop types
    WithApollo.propTypes = {
      // Used for getDataFromTree rendering
      apolloClient: PropTypes.object,
      // Used for client/server rendering
      apolloState: PropTypes.object
    };
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx) => {
      const { AppTree } = ctx;

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apolloClient = (ctx.apolloClient = initApolloClient(null, {
        getToken: () => getToken(ctx.req)
      }));

      const pageProps = PageComponent.getInitialProps
        ? await PageComponent.getInitialProps(ctx)
        : {};

      // Only on the server
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return {};
        }

        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            // console.error('Error while running `getDataFromTree`', error);
          }
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState
      };
    };
  }

  return WithApollo;
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
function initApolloClient(...args) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(...args);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(...args);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 * @param  {Object} config
 *
 */

function createApolloClient(initialState = null, { getToken }) {
  const fetchOptions = {};
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });

  const uploadLink = createUploadLink({
    credentials: 'same-origin',
    fetch,
    fetchOptions,
    uri: `${process.env.API_URL}`
  });

  const authLink = setContext(async (request, { headers }) => {
    const token = await getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const cache = new InMemoryCache({
    fragmentMatcher,
    cacheRedirects: {}
  }).restore(initialState ? initialState : {});

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([authLink, cleanTypenameLink, uploadLink]),
    cache,
    // allows @client queries
    resolvers: {}
  });
  return client;
}

/**
 * Get the user token from cookie
 * @param {Object} req
 */
async function getToken(req) {
  if (req) {
    const { accessToken } = await auth0.getSession(req);
    return accessToken;
  }
  const res = await fetch('/api/profile');
  if (res.ok) {
    const { accessToken } = await res.json();
    return accessToken || '';
  }
  return '';
}
