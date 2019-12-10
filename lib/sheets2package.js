/*
 * Create a datapackage.json file from a Google Sheet
 */

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const config = require('../config.js');
const descriptor = require('./suomidigi-roadmap-descriptor.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = config.token;
const CREDENTIALS = config.credentials;

// sheets2package(function(res) {console.log(res);});

function sheets2package(callback) {
  fs.readFile(CREDENTIALS, (err, content) => {
    if (err) {
      return console.log('Error loading client secret file:', err);
    }
    authorize(JSON.parse(content), (auth) => {handleSheets(auth, callback);});
  });
}

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error('Error while trying to retrieve access token', err);
      }
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function handleSheets(auth, callback) {
  const sheets = google.sheets({version: 'v4', auth});

  sheets.spreadsheets.get({
    spreadsheetId: config.roadmapSpreadsheet,
    includeGridData: false
  }, (err, res) => {
    if (err) {
      return console.error('The API returned an error: ' + err);
    }
    const tabs = res.data.sheets;
    let ranges = [];
    tabs.forEach((sheet) => {
      ranges.push(sheet.properties.title+'!A1:Z');
    });
    sheets.spreadsheets.values.batchGet({
      spreadsheetId: config.roadmapSpreadsheet,
      ranges: ranges,
      valueRenderOption: 'FORMATTED_VALUE',
    }, (err, res) => {
      if (err) {
        return console.error('The API returned an error: ' + err);
      }
      const areas = res.data.valueRanges;
      if (areas.length < 1) {
        return console.log('No data found.');
      }
      for (var i=0; i<descriptor.resources.length; i++) {
        let values = areas[i].values || [];
        let fields = descriptor.resources[i].schema.fields;
        // replace header values
        for (var j=0; j<fields.length; j++) {
          values[0][j] = fields[j].name;
        }
        // add back empty values that Sheets API omits
        values.forEach((row) => {
          let expectedLength = descriptor.resources[i].schema.fields.length;
          while (row.length < expectedLength) {
            row.push("");
          }
        });
        descriptor.resources[i].data = values;
      }
      callback(descriptor);
    });
  });
}

module.exports = sheets2package;
