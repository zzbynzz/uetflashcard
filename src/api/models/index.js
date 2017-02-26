var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');
// setup plugins
mongoose.plugin(uniqueValidator);
mongoose.plugin(deepPopulate);

module.exports.User = mongoose.model('User', require('./userSchema'));
module.exports.StudySet = mongoose.model('StudySet', require('./studySetSchema'));