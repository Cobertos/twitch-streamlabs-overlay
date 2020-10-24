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
    body: `grant_type=authorization_code&client_id=${clientID}&client_secret=${clientSecret}&redirect_url=${redirectURI}&code=${code}`
  });
  const json = await resp.json();
  if(!json.access_code) {
    console.error(json);
    throw new Error('No access_code was obtained');
  }

  res.json({
    access_code: json.access_code,
  });
}