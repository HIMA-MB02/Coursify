var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = require('./course.model').CourseSchema;

const CandidateSchema = new Schema( {
    firstName: String,
    lastName: String,
    age: Number,
    courses: [CourseSchema]
});

const Candidate = mongoose.model('candidates', CandidateSchema);

module.exports = {
    CandidateSchema: CandidateSchema,
    Candidate: Candidate
};