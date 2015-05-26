var express = require('express');
var middleware = require('./config/middleware.js');
var app = express();

middleware(app, express);

var db = require('./db.js');

module.exports = app;
