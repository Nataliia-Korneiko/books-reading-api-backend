const { userService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const logout = async (req, res, next) => {
  const userId = req.user._id;

  try {
    await services.updateToken(userId, null);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.NO_CONTENT,
      message: 'Successful operation',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = logout;
