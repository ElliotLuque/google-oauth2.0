const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
];
let userCredential = null;

async function main() {
    const app = express();

    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    }));

    app.get('/login', async (req, res) => {
        const state = crypto.randomBytes(32).toString('hex');
        req.session.state = state;

        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: state
        });
        res.redirect(authorizationUrl);
    });

    app.get('/auth/status', async (req, res) => {
        if (req.session.isAuthenticated) {
            res.setHeader('Content-Type', 'application/json');
            // TODO: Llamar a google.people
        } else {
            const response = {
                message: "not logged in"
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(response)
        }
    })

    app.get('/oauth2callback', async (req, res) => {
        let q = url.parse(req.url, true).query;

        if (q.error) {
            console.log('Error:' + q.error);
        } else if (q.state !== req.session.state) {
            console.log('State mismatch. Possible CSRF attack');
            res.end('State mismatch. Possible CSRF attack');
        } else {
            let { tokens } = await oauth2Client.getToken(q.code);
            oauth2Client.setCredentials(tokens);
            userCredential = tokens;
            req.session.isAuthenticated = true;

            res.setHeader('Content-Type', 'application/json');
            res.json(userCredential)
        }
    });

    app.get('/revoke', async (req, res) => {
        let postData = "token=" + userCredential.access_token;

        let postOptions = {
            host: 'oauth2.googleapis.com',
            port: '443',
            path: '/revoke',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const postReq = https.request(postOptions, function(res) {
            res.setEncoding('utf8');
            res.on('data', d => {
                console.log('Response: ' + d);
            });
        });

        postReq.on('error', error => {
            console.log(error)
        });

        postReq.write(postData);
        postReq.end();
    });


    const server = http.createServer(app);
    server.listen(3000);
}
main().catch(console.error);
