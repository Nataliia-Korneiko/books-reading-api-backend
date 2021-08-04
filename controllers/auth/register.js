const jwt = require('jsonwebtoken');
const { userService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');
require('dotenv').config();

const { JWT_SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await services.getUserByEmail(email);

    if (user) {
      return res.status(httpCode.CONFLICT).json({
        status: 'error',
        code: httpCode.CONFLICT,
        message: 'Provided email already exists',
      });
    }

    if (!email || !password) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'error',
        code: httpCode.BAD_REQUEST,
        message: 'Required fields are missing',
      });
    }

    const newUser = await services.addUser({
      name,
      email,
      password,
    });

    const id = newUser._id;
    const payload = { id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '16h' });

    await services.updateToken(id, token);

    res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      message: 'Successful operation',
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          books: newUser.books,
          training: newUser.training,
          token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = register;
