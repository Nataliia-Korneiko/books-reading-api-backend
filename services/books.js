const { Book } = require('../models');
const { User } = require('../models');

const getAll = async (userId) => {
  try {
    return Book.find({ user: userId });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOne = async (bookId) => {
  try {
    return Book.findById(bookId);
  } catch (error) {
    throw new Error(error.message);
  }
};

const addOne = async (userId, body) => {
  try {
    const book = await Book.create(body);
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          books: book._id,
        },
      },
      {
        new: true,
      }
    );
    return book;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteOne = async (userId, bookId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          books: bookId,
        },
      },
      {
        new: true,
      }
    );

    return Book.findByIdAndDelete(bookId);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateOne = async (bookId, rating, resume) => {
  try {
    const book = await Book.findByIdAndUpdate(
      bookId,

      { rating, resume },
      { new: true }
    );

    return book;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAll,
  getOne,
  addOne,
  deleteOne,
  updateOne,
};
