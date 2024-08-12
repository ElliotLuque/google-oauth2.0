const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const cors = require('cors')

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

google.options({ auth: oauth2Client })

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];
let userCredential = null;

async function main() {
    const app = express();

    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Quitar en producción
    }));
    app.use(cors({
        origin: ['http://127.0.0.1:5555', 'http://localhost:5555'],
        credentials: true,
    }))

    app.get('/auth/login', async (req, res) => {
        const state = crypto.randomBytes(32).toString('hex')

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
            const people = google.people({
                version: 'v1',
                auth: oauth2Client
            })

            const userinfo = await people.people.get({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses,photos'
            })

            const response = {
                loggedIn: true,
                name: userinfo.data.names[0].displayName ?? 'Unknown',
                email: userinfo.data.emailAddresses[0].value ?? 'Unknown',
                photo: userinfo.data.photos[0].url ?? null
            }

            res.setHeader('Content-Type', 'application/json');
            res.json(response)
        } else {
            const response = {
                loggedIn: false,
                message: 'Not logged in.'
            }
            res.json(response)
        }
    })

    app.get('/oauth2callback', async (req, res) => {
        let q = url.parse(req.url, true).query;

        if (q.error) {
            console.log('Error:' + q.error);
            res.status(400).send('Error during authentication');
        } else {
            if (q.state !== req.session.state) {
                console.log('State mismatch. Possible CSRF attack');
                res.status(400).send('State mismatch. Possible CSRF attack');
            } else {
                try {
                    let { tokens } = await oauth2Client.getToken(q.code);
                    oauth2Client.setCredentials(tokens);
                    userCredential = tokens;
                    req.session.isAuthenticated = true;

                    res.redirect('http://localhost:5555')
                } catch (error) {
                    console.error('Error getting tokens:', error);
                    res.status(500).send('Error getting tokens');
                }
            }
        }
    });

    app.get('/auth/logout', async (req, res) => {
        if (!userCredential.access_token) {
            return res.status(400).json({ message: 'No token to revoke.' });
        }
        let postData = `token=${userCredential.access_token}`;
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

        const postReq = https.request(postOptions, (revokeRes) => {
            if (revokeRes.statusCode === 200) {
                req.session.destroy(err => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to log out.' });
                    }

                    res.clearCookie('connect.sid', { path: '/' });
                    return res.json({ message: 'Logged out and token revoked successfully' });
                });
            } else {
                res.status(500).json({ message: 'Failed to revoke token.' });
            }
        });

        req.session.isAuthenticated = false;

        postReq.on('error', error => {
            console.log(error)
        });

        postReq.write(postData);
        postReq.end();
    });


    const server = http.createServer(app);
    server.listen(process.env.PORT);
}
main().catch(console.error);
