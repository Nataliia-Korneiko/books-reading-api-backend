const express = require('express');
const router = express.Router();
const { books: ctrl } = require('../../controllers');
const useAuth = require('../../helpers/useAuth');
const { validateUpdateResume } = require('../../validation/books');

router.get('/', useAuth, ctrl.getAll);
router.post('/', useAuth, ctrl.addOne);
router.patch('/:bookId', useAuth, validateUpdateResume, ctrl.updateOne);
router.delete('/:bookId', useAuth, ctrl.deleteOne);

module.exports = router;
