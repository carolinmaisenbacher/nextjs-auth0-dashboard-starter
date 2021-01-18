import checkLoggedIn from 'lib/checkLoggedIn';
import redirect from 'lib/redirect';

export default async function requireAuthentification(context) {
  const { user } = await checkLoggedIn(context.apolloClient);

  if (!user.username) {
    redirect(context, '/auth/login');
  }

  return { user };
}
