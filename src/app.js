require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewares
app.use(morgan("dev")); // show log of some information for request // use for develop, status is have color
// app.use(morgan("combined")); // response follow apache standard: IP, url, time, method, status, source (curl, postman...)... -> use for product
// app.use(morgan("common")); // as above, but do not have source (curl, postman...)
// app.use(morgan("short")); // IP, url, method, status, time response 
// app.use(morgan("tiny")); // method, status, time

app.use(helmet()); // prevent some information about structure that we use for project, technology that REST API use,... (express, chrome, firefox....)
app.use(compression()); // use for decrease size of file to save cost for db with each request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require('./dbs/init.mongodb');

// init routes
app.use('', require('./routes'));

// handling error

module.exports = app;