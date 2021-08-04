const { userService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const getCurrent = async (req, res, next) => {
  const { _id: userId } = req.user;

  try {
    const user = await services.getUserById(userId);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          books: user.books,
          training: user.training,
          token: user.token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getCurrent;
