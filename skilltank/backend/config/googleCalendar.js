const fs = require("fs");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

const auth = new google.auth.GoogleAuth({
    keyFile: "config/credentials.json",
    scopes: SCOPES
});

const calendar = google.calendar({ version: "v3", auth });

module.exports = calendar;
