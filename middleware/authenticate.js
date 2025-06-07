const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json('you do not have access.');
    }
    next();
};

module.exports = {
    isAuthenticated
}