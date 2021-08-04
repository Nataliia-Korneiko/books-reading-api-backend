const { Training } = require('../models');
const { User } = require('../models');
const { Book } = require('../models');
const moment = require('moment');

const addOne = async (userId, body) => {
  try {
    const training = await Training.create(body);

    await User.findByIdAndUpdate(
      userId,
      {
        training: training._id,
      },
      {
        new: true,
      }
    );

    const booksUpdateQueries = body.books.map((id) => {
      const query = Book.findByIdAndUpdate(id, {
        status: 'read',
      });
      const promise = query.exec();
      return promise;
    });

    await Promise.all(booksUpdateQueries);
    return training;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOne = async (id) => {
  try {
    return Training.findById(id)
      .populate({
        path: 'books',
        select: '-createdAt -updatedAt',
      })
      .populate({
        path: 'user',
        select: '-createdAt -updatedAt -password',
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateOne = async (userId, id, body) => {
  try {
    const { date, time, pages } = body;
    const { result, books, finishDate } = await Training.findById(id).populate(
      'books'
    );

    const unreadBooks = books.filter((item) => item.status === 'read');
    let readPages = pages;
    const booksToUpdate = [];

    for (const item of unreadBooks) {
      const diff = item.totalPages - item.readPages;

      if (diff > readPages) {
        item.readPages += readPages;
        readPages = 0;
        booksToUpdate.push(item);
        break;
      }

      item.readPages = item.totalPages;
      item.status = 'done';
      booksToUpdate.push(item);
      readPages -= diff;
    }

    const booksUpdateQueries = booksToUpdate.map((item) => {
      const query = Book.findByIdAndUpdate(item._id, {
        readPages: item.readPages,
        status: item.status,
      });

      const promise = query.exec();
      return promise;
    });

    await Promise.all(booksUpdateQueries);

    const totalPages = books.reduce((acc, value) => {
      return acc + value.totalPages;
    }, 0);

    const factPages = result.reduce((acc, value) => {
      const dayFactPages = value.stats.reduce((acc, value) => {
        return acc + value.pages;
      }, 0);
      return acc + dayFactPages;
    }, pages);

    const formatNow = moment(date + ' ' + time, 'DD.MM.YYYY HH:mm:ss');

    const formatEndDate = moment(
      finishDate + ' ' + '23:59:59',
      'DD.MM.YYYY HH:mm:ss'
    );

    const lastDays = formatEndDate.diff(formatNow, 'days', 'hours');

    let plannedPages = Math.ceil((totalPages - factPages) / lastDays);
    if (plannedPages < 0 || Infinity) {
      plannedPages = 0;
    }

    const endTraining = books.some((item) => item.status === 'read');
    if (!endTraining) {
      await User.findByIdAndUpdate(userId, {
        training: null,
      });
    }

    const newResult = result.find((item) => item.date === date);

    if (newResult) {
      newResult.plannedPages = plannedPages;
      newResult.factPages += pages;
      newResult.stats.push({ time, pages });
    } else {
      result.push({
        date,
        plannedPages,
        factPages: pages,
        stats: [{ time, pages }],
      });
    }

    return await Training.findByIdAndUpdate(
      id,
      {
        inProgress: endTraining,
        result,
      },
      { new: true }
    )
      .populate({
        path: 'books',
        select: '-createdAt -updatedAt',
      })
      .populate({
        path: 'user',
        select: '-token -password -createdAt -updatedAt',
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addOne,
  getOne,
  updateOne,
};
