import auth0 from '../../lib/auth0';

export default async function profile(req, res) {
  try {
    const session = await auth0.getSession(req);
    res.send(session);
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
