// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ympq6vbglc'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-kl7qyk44.us.auth0.com',            // Auth0 domain
  clientId: 'cbEjn6Bk3TYD6noZTEtlkOG88cNQvUKZ',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
