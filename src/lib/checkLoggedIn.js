import gql from 'graphql-tag';

export default function checkLoggedIn(apolloClient) {
  return apolloClient
    .query({
      query: gql`
        query getUser {
          me {
            id
            username
          }
        }
      `
    })
    .then(({ data }) => {
      return { user: data.me };
    })
    .catch(() => {
      // Fail gracefully
      return { user: {} };
    });
}
