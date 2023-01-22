const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const operations = require('./operations');

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...operations
};