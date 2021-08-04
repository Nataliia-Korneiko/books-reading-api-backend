const { trainingService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const addOne = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { startDate, finishDate, books } = req.body;

  try {
    if (!startDate || !finishDate || !books) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'error',
        code: httpCode.BAD_REQUEST,
        message: 'Missing some fields',
      });
    }

    const newTraining = await services.addOne(userId, {
      startDate,
      finishDate,
      books,
      user: userId,
    });

    const training = await services.getOne(newTraining._id);

    res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
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
    return res.status(httpCode.BAD_REQUEST).json({
      status: 'error',
      code: httpCode.BAD_REQUEST,
      message: 'Successful operation',
    });
  }
};

module.exports = addOne;
