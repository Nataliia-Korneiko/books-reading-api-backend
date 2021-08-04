const { model } = require('mongoose');
const { trainingSchema } = require('./schemas');

const Training = model('training', trainingSchema);

module.exports = Training;
