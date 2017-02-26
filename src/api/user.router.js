var restify = require('restify');
var jwt = require('jsonwebtoken');
var Router = require('restify-router').Router;
var routerInstance = new Router();
var models = require('./models');
var jwtAuth = require('./auth/jwt');

routerInstance.get('/', jwtAuth, doIndex);
routerInstance.post('/auth', doAuthentication);
routerInstance.get('/user/signout', doSignout);
routerInstance.put('/user/:userId', function(){});

module.exports = routerInstance;

function doIndex(req, res, next){
    res.send({status: true, data: req.loggedUser});
}

function doAuthentication(req, res, next){
    if (req.body && req.body.email){
        models.User.findOne({email: req.body.email}).exec(function(err, doc){
            if (err) {
                return next(new restify.InternalServerError());
            }

            if (!doc){
                // create new user profile
                var userJson;
                if (req.body.googleId){
                    userJson = {email: req.body.email, name: req.body.name, photo: req.body.imageUrl};
                } else {
                    userJson = {email: req.body.email, name: req.body.name, photo: req.body.picture.data.url};
                }
                var user = new models.User(userJson);
                user.save(function(err, doc){
                    if (err) {
                        return next(new restify.InternalServerError());
                    }
                    var userToEncode = {email: userJson.email, name: userJson.name};
                    var quizToken = jwt.sign(userToEncode, "quantb", {
                        expiresIn: '30 days'
                    });
                    return res.send({status: true, data: {loggedUser: doc, quizToken: quizToken}});
                })
            } else {
                var userToEncode = {email: doc.email, name: doc.name};
                var quizToken = jwt.sign(userToEncode, "quantb", {
                    expiresIn: '30 days'
                });
                return res.send({status: true, data: {loggedUser: doc, quizToken: quizToken}});
            }
        });
    }
}

function doSignout(req, res, next){
    return res.send({status: true});
}