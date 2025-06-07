const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json('you do not have access.');
};

module.exports = { isAuthenticated };