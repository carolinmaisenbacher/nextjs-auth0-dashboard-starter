import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: process.env.AUTH0_SCOPE,
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  redirectUri: `${process.env.PRODUCTION_URL}/api/callback`,
  postLogoutRedirectUri: process.env.PRODUCTION_URL,
  session: {
    cookieSecret: process.env.SESSION_COOKIE_SECRET,
    cookieLifetime: process.env.SESSION_COOKIE_LIFETIME,
    storeAccessToken: true
  }
});
