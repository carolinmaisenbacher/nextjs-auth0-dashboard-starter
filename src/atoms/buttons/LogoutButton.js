import React from 'react';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

const LogoutButton = () => {
  const router = useRouter();
  const client = useApolloClient();

  const handleLogout = (e) => {
    e.preventDefault();
    router.push('/api/logout');
    client.resetStore();
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
