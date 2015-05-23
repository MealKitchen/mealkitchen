var express = require('express');
var middleware = require('./config/middleware.js');
var app = express();

middleware(app, express);

module.exports = app;
