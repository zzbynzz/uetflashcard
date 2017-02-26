var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, email: true, unique: true},
    photo: {type: String, required: true},
    studySets: [{type: ObjectId, ref: 'StudySet'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});
module.exports = userSchema;