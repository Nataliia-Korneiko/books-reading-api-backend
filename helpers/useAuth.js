const passport = require('passport');
const { httpCode } = require('../helpers/constants');
require('../config/config-passport');

const useAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    try {
      const [, token] = req.get('Authorization').split(' ');

      if (error || !user || token !== user.token) {
        return res.status(httpCode.UNAUTHORIZED).json({
          status: 'error',
          code: httpCode.UNAUTHORIZED,
          message: 'Not authorized',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'error',
        code: httpCode.BAD_REQUEST,
        message: 'Invalid request body / Token not provided',
      });
    }
  })(req, res, next);
};

module.exports = useAuth;
