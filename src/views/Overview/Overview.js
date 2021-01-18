import React from 'react';
import PropTypes from 'prop-types';
import { LogoutButton } from 'atoms/buttons';

const Overview = ({ user }) => {
  return (
    <>
      <h1>{`Welcome ${user.username}!`}</h1>
      <h3>You successfully logged in.</h3>
      <LogoutButton />
    </>
  );
};

Overview.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  }).isRequired
};

export default Overview;
