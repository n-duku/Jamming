const clientId = "9e47c35a32d94a5f906d5bcfb234edc5";
const redirectUri = "http://ag-jamming.surge.sh";
let accessToken;
const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    //check for accessToken match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // clears parameters to allow access to new token after expiration

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `
      https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}
      `;
      window.location = accessUrl;
    }
  },
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((jsonResp) => {
        if (!jsonResp.tracks) {
          return [];
        }
        return jsonResp.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },
  savePlayList(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
    return fetch("https://api.spotify.com/v1/me", { headers: headers }).then(
      resp => resp.json()
    ).then(jsonResp => {
      userId = jsonResp.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(resp => resp.json())
    }).then(jsonResp => {
      const playlistId = jsonResp.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({uris: trackUris})
      })
    })
  },
};
export default Spotify;
