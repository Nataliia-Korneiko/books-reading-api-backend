const { trainingService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const updateOne = async (req, res, next) => {
  const user = req.user;

  if (!user.training) {
    return res.status(httpCode.BAD_REQUEST).json({
      status: 'fail',
      code: httpCode.BAD_REQUEST,
      message: 'No current training in user',
    });
  }

  const { _id: id } = user.training;

  const { body } = req;

  try {
    const training = await services.updateOne(user._id, id, body);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
      data: {
        _id: training.id,
        user: training.user,
        books: training.books,
        inProgress: training.inProgress,
        startDate: training.startDate,
        finishDate: training.finishDate,
        result: training.result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateOne;
