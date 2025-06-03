const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));
router.use('/movies', require('./movies'));
router.use('/directors', require('./directors'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function (req, res, next) {
    req.logout(function(err) {
        if (err){ return next(err); }
        res.redirect('/');
    });
});

module.exports = router;


// router.get('/',(req, res) => {
//     //#swagger.tags=['Wellcomer to the Movies API']
//     res.send('Wellcome to the Movies API');
// });

// app.use(cors());
// app.use(express.json());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// app.use('/movies', require('./routes/movies'));
// app.use('/directors', require('./routes/directors'));
// app.use('/', require('./routes'));

