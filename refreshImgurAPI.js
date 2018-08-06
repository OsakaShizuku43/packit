const creds = require('./imgur_cred.json');
const axios = require('axios');
const fs = require('fs');

let content;
if (fs.existsSync('./imgurAPITokens.json')) {
    content = JSON.parse(fs.readFileSync('./imgurAPITokens.json', 'utf8'));
} else {
    content = {};
}

axios.post('https://api.imgur.com/oauth2/token', {
    refresh_token: creds.refreshToken,
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    grant_type: 'refresh_token'
}).then((res) => {
    content = {
        clientId: creds.clientId,
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token
    };
    console.log('New token set!');
    fs.writeFileSync('./imgurAPITokens.json', JSON.stringify(content));
    console.log('Wrote to file');
}).catch((err) => {
    console.log("ERROR:", err.response);
});
