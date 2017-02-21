/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

require('dotenv').config();

var express = require('express');
var helmet = require('helmet');
var cors = require('cors');

var path = require('path');
var fsr = require('file-stream-rotator');
var mkdirp = require('mkdirp');
var morgan = require('morgan');

var routes = require('./routes');

//*******************************************************************
// environment variables

var PORT = process.env.PORT;

//*******************************************************************
// express

var app = express();

app.use(cors());
app.use(helmet());

// **********************************************************
// log

var logDirectory = path.join(__dirname,'/log');
    
mkdirp(logDirectory);

var accessLogStream = fsr.getStream({
    filename: logDirectory + '/fs-epermit-api-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}));

//*******************************************************************
// public 

app.use(express.static('public'));

//*******************************************************************
// routes

app.use('/', routes);

//*******************************************************************
// listen

var server = app.listen(PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('\n  listening at http://%s:%s', host, port);

});

//*******************************************************************
// exports

module.exports = app;

//*******************************************************************
