/**
 * Created by Anh on 19/02/2017.
 */
var restify = require('restify');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/' + env);

var server = restify.createServer();
server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.CORS({credentials: true, origins: ['*']}));
server.use(restify.requestExpiry(config.server.requestExpiry));
server.use(restify.requestLogger());
server.use(restify.throttle(config.server.throttle));
mongoose.connect(config.mongodb.url, config.mongodb.options); // connect to our database

// Apply routes
require('./api/user.router').applyRoutes(server, '/api/v1');
require('./api/study.router').applyRoutes(server, '/api/v1');

server.listen(config.server.port, function () {
    console.log('%s started at %s://%s:%s', config.server.name, config.server.protocol, config.server.host, config.server.port);
});

module.exports = server;