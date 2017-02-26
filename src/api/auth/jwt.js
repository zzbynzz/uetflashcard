var jwt = require('jsonwebtoken');
var restify = require('restify');
var models = require('../models');
module.exports = function(req, res, next){
    var quizToken = req.header('QUIZ-TOKEN');
    if (quizToken){
        jwt.verify(quizToken, 'quantb', function(err, decoded){
            if (err) {
                return next (new restify.ForbiddenError());
            }
            models.User.findOne({email: decoded.email}).exec(function(err, doc){
                if (err || !doc) {
                    return next (new restify.ForbiddenError());
                }
                req.loggedUser = doc;
                next();
            });
        });

    } else {
        return next(new restify.ForbiddenError());
    }
}