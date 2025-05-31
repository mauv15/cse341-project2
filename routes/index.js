const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/',(req, res) => {
    //#swagger.tags=['Wellcomer to the Movies API']
    res.send('Wellcome to the Movies API');
});

module.exports = router;