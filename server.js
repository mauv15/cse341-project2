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

// ---------------------- Middleware ----------------------
app.use(cookieParser());
app.use(bodyParser.json());

// ✅ Use session with secure: false (for local dev)
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false // Only use true if on HTTPS
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Clean and correct CORS config
app.use(cors({
    origin: 'https://cse341-project2-jxd1.onrender.com', // Adjust if your frontend runs elsewhere
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization'
}));

// ---------------------- GitHub Auth ----------------------
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://cse341-project2-jxd1.onrender.com/github/callback'
},
function(accessToken, refreshToken, profile, done) {
    console.log('GitHub profile:', profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// ---------------------- Routes ----------------------
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

// ✅ Swagger docs (with credentials enabled)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
        withCredentials: true
    }
}));

// ✅ Your API routes (ensure these check req.isAuthenticated())
app.use('/', require('./routes/index.js'));
app.use('/movies', require('./routes/movies'));
app.use('/directors', require('./routes/directors'));

// ---------------------- Mongo Init ----------------------
mongodb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Running on port ${port}`);
        });
    }
});
