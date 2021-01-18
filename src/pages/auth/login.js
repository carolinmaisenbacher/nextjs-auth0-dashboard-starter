import Login from 'views/Login';
import React from 'react';
import checkLoggedIn from 'lib/checkLoggedIn';
import redirect from 'lib/redirect';
import { withApollo } from 'lib/apollo';

import { Auth } from 'layouts';

const LoginPage = () => (
  <Auth>
    <Login />
  </Auth>
);

LoginPage.getInitialProps = async (context) => {
  const { user } = await checkLoggedIn(context.apolloClient);
  if (user.username) {
    // Already signed in?
    // Throw them back to the main page
    redirect(context, '/');
  }

  return {};
};

export default withApollo(LoginPage);
