const { trainingService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const getCurrent = async (req, res, next) => {
  if (!req.user.training) {
    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
      data: null,
    });
  }

  const { _id: id } = req.user.training;

  try {
    const training = await services.getOne(id);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
      data: {
        _id: training.id,
        user: training.user.id,
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

module.exports = getCurrent;
