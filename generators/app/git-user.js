const utils = require('git-user-name/utils');

module.exports = function(options) {
  options = utils.extend({cwd: '/', path: utils.gitconfig}, options);
  const config = utils.parse.sync(options);
  if (!utils.isObject(config) || !utils.isObject(config.user)) {
    return null;
  }
  return config.user;
};
