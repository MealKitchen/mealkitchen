var db = require('../db');


var User = db.Model.extend({
  tableName: 'users'
})

module.exports = User;
