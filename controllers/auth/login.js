const jwt = require('jsonwebtoken');
const { userService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');
require('dotenv').config();

const { JWT_SECRET_KEY } = process.env;

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await services.getUserByEmail(email);

    if (!user) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const isValidPassport = await user.validPassword(password);

    if (user.validPassword(password) === null || !isValidPassport) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '16h' });

    await services.updateToken(id, token);

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
          token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
