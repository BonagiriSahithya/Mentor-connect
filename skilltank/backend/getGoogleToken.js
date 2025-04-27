const { google } = require("googleapis");
const readline = require("readline");

// Load credentials from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/oauth2callback"; // Change this if deployed

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function getAccessToken() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline", // Ensures we get a refresh token
        scope: SCOPES,
    });

    console.log("1️⃣ Open this URL in your browser:", authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("2️⃣ Paste the code from the URL here: ", (code) => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error("❌ Error retrieving access token", err);
                return;
            }
            console.log("\n✅ Your Refresh Token:", token.refresh_token);
            console.log("\n👉 Save this token in your `.env` file as `REFRESH_TOKEN=your_refresh_token`");
        });
    });
}

getAccessToken();



