// contain function, class, feature that we usually use
'use strict'

const pick = require('lodash/pick');

const getIntoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
}

module.exports = {
  getIntoData
}