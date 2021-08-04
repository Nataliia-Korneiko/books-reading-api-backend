const express = require('express');
const router = express.Router();
const { training: ctrl } = require('../../controllers');
const useAuth = require('../../helpers/useAuth');

router.get('/', useAuth, ctrl.getCurrent);
router.post('/', useAuth, ctrl.addOne);
router.patch('/', useAuth, ctrl.updateOne);

module.exports = router;
