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

const swagger = require('./swaggerConfig');


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

    .use(cors({
        origin: 'https://localhost:3001', // Swagger UI runs here, not 3001!
        credentials: true,
        methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }))
    .use('/', require('./routes/index.js'))
    .use('/movies', require('./routes/movies'))
    .use('/directors', require('./routes/directors'))

    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

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