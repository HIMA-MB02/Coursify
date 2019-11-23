var mongoose = require('mongoose');

const Schema = mongoose.Schema;

let CourseSchema = new Schema({
    courseName: String,
    domainName: String,
    startDate: String,
    trainerName: String,
    isActive: Boolean
});


const Course = mongoose.model('courses', CourseSchema);

module.exports = {
    CourseSchema: CourseSchema,
    Course: Course
};