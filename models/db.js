var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectId;

module.exports = new Db(settings.db,new Server(settings.host,settings.port,{}));