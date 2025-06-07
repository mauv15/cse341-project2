const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const GitHubStrategy = require('passport-github2').Strategy;

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3001;

app
    .use(cookieParser())
    .use(bodyParser.json())
    .use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    }))

    .use(passport.initialize())
    .use(passport.session())

    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
        );
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        );
        next();
    })

    .use(cors({ methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }))
    .use(cors({
        origin: 'http://localhost:3000', // or wherever your frontend is running
        credentials: true
    }))
    .use('/', require('./routes/index.js'))
    .use('/movies', require('./routes/movies'))
    .use('/directors', require('./routes/directors'));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/github/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('GitHub profile:', profile);
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const name = req.user.displayName || req.user.username || 'Unknown';
    return res.send(`Logged in as ${name}`);
  } else {
    return res.send('Logged Out');
  }
});



app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs'
}), (req, res) => {
    res.redirect('/');
});

mongodb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Running on port ${port}`);
        });
    }
});