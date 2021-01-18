import auth0 from '../../lib/auth0';

export default async function login(req, res) {
  try {
    await auth0.handleLogin(req, res);
  } catch (error) {
    if (!error.status || !error.message) {
      error.message = 'Could not connect to authentification service.';
    }
    res.status(error.status || 500).end(error.message);
  }
}
