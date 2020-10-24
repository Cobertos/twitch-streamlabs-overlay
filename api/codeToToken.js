const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const clientID = "tKjGdvsJGyCIhN2jZ19bYgsClHs8UFgwIidstmFk";
  const clientSecret = process.env.STREAMLABS_CLIENT_SECRET;
  const redirectURI = encodeURIComponent("https://twitch-streamlabs-overlay.vercel.app");
  const code = req.query.code;

  // Take code from request
  const resp = await fetch(`https://streamlabs.com/api/v1.0/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=authorization_code&client_id=${clientID}&client_secret=${clientSecret}&redirect_uri=${redirectURI}&code=${code}`
  });
  const json = await resp.json();
  if(!json.access_token) {
    console.error(json);
    throw new Error('No access_code was obtained');
  }

  // CORS, if coming from an origin we accept (localhost or production app)
  const match = req.headers.Origin
    .match(/^https?:\/\/(localhost:42069|twitch-streamlabs-overlay\.vercel\.app)\/?$/);
  if(match) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.Origin);
  }
  res.json({
    access_token: json.access_token,
  });
}