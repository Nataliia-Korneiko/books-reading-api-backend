const { bookService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const getAll = async (req, res, next) => {
  const { _id: userId } = req.user;

  try {
    const books = await services.getAll(userId);

    if (!books) {
      return res.status(httpCode.NOT_FOUND).json({
        status: 'fail',
        code: httpCode.NOT_FOUND,
        message: 'Not found',
      });
    }

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
      data: {
        books,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAll;
