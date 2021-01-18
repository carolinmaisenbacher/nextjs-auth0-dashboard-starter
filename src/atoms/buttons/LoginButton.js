import React from 'react';
import { useRouter } from 'next/router';

const LoginButton = () => {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/api/login');
  };
  return <button onClick={handleLogin}>Login</button>;
};

export default LoginButton;
