var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var studySchema = new Schema({
    term: String,
    definition: String,
    id: {type: String, unique: true}
}, { _id : false });
var studySetSchema = new Schema({
    title: {type: String, required: true},
    sets: [studySchema],
    termLanguage: String,
    definitionLanguage: String,
    image: String,
    createdBy: {type: ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = studySetSchema;