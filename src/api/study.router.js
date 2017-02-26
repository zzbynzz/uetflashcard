var restify = require('restify');
var Router = require('restify-router').Router;
var fs = require('fs');
var path = require('path');
var shortid = require('shortid');
var routerInstance = new Router();
var models = require('./models');
var jwtAuth = require('./auth/jwt');
routerInstance.use(jwtAuth);
routerInstance.get('/sets', function () {});
routerInstance.get('/sets/:setId', function () {});
routerInstance.post('/sets', saveStudySets);
routerInstance.post('/sets/upload', handleUploadFile);
routerInstance.put('/sets/:setId', function () {});
routerInstance.del('/sets/:setId', function () {});

const IMAGE_PATH = '/images/';
module.exports = routerInstance;


function saveStudySets(req, res, next) {
    var studySetId = req.body.studySetId;
    var title = req.body.title;
    var sets = req.body.sets;
    var termLanguage = req.body.termLanguage;
    var definitionLanguage = req.body.definitionLanguage;
    var image = req.body.image;

    if (studySetId) {
        models.StudySet.findById(studySetId).exec(function (err, set) {
            if (err) {
                return next(new restify.InternalServerError());
            }

            if (!set) {
                return next(new restify.NotFoundError());
            }

            set.title = title;
            set.sets = sets;
            set.termLanguage = termLanguage;
            set.definitionLanguage = definitionLanguage;
            set.image = image;
            s.save(function (err) {
                if (err) {

                    return next(new restify.InternalServerError(err));
                }

                return res.send({status: true});
            })
        });
    } else {

        var s = new models.StudySet({
            title: title,
            sets: sets,
            createdBy: req.loggedUser.id,
            termLanguage: termLanguage,
            definitionLanguage: definitionLanguage,
            image: image
        });

        s.save(function (err) {
            if (err) {
                return next(new restify.InternalServerError());
            }

            return res.send({status: true});
        })
    }
}

function handleUploadFile(req, res, next) {
    if (req.files) {
        var ext = path.extname(req.files.file0.name);
        var filename = shortid.generate();
        var outputPath = path.join(__dirname, '../www/images/' + filename + ext);
        var wstream = fs.createWriteStream(outputPath);
        fs.readFile(req.files.file0.path, function (err, data) {
            if (err) {
                return next(new restify.InternalServerError());
            }
            wstream.on('finish', function (err) {
                if (err) {
                    return next(new restify.InternalServerError());
                }
                res.send({status: true, data: {filename: IMAGE_PATH + filename + ext}});
            });
            wstream.write(data);
            wstream.end();
        });
    }

}