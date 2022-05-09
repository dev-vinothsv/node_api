var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var crypto = require('crypto');
const helmet = require('helmet');
const cors = require('cors');

var app = express();


require('dotenv').config();
var db = require('./config/connectDB');

//Database Connection End to here
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(logger('dev'));

app.use((err, req, res, next) => {
     console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});


var login_route = require('./routes/login');
var register_route = require('./routes/register');
var dashboard_route = require('./routes/dashboard');
var users_route = require('./routes/users');
var locations_route = require('./routes/locations');
/*Routes*/
app.use('/api/v1', login_route);
app.use('/api/v1', register_route);
//app.use('/', dashboard_route);
//app.use('/users', users_route);
//app.use('/locations', locations_route);


module.exports = app;
