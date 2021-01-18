// DOCUMENTATION: http://styletron.org
import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'lib/apollo';
import requireAuthentification from 'lib/requireAuthentification';

import { Dashboard } from 'layouts';
import { Overview } from 'views/Overview';

const IndexPage = ({ user }) => {
  // an alternative hook based API
  return (
    <Dashboard>
      <Overview user={user} />
    </Dashboard>
  );
};

IndexPage.getInitialProps = async (context) => {
  // redirects if not logged in, and adds user object to props
  return await requireAuthentification(context);
};

IndexPage.propTypes = {
  user: PropTypes.shape().isRequired
};

export default withApollo(IndexPage);
