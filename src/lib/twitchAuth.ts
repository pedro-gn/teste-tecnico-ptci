//Usado para pega o access token da api da twitch, pq a api do IGDB
//usa o twitch developers para autenticação

let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

type reqBody = {
    client_id : string,
    client_secret : string,
    grant_type : string,
};

export async function getTwitchToken() {
  if (tokenCache.accessToken && (Date.now()*1000) < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  const url = 'https://id.twitch.tv/oauth2/token';
  const body = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials',
  } as reqBody );

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get Twitch token: ${errorData.message}`);
    }

    const data = await response.json();


    tokenCache.accessToken = data.access_token;
    tokenCache.expiresAt = (Date.now() * 1000) + (data.expires_in - 10) ; 

    return tokenCache.accessToken;

  } catch (error) {
    console.error("Error fetching Twitch token:", error);
    return null;
  }
}