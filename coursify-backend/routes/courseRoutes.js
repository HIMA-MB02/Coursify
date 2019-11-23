var express = require('express');
var router = express.Router();
let Course = require('../models/course.model').Course;
let Candidate = require('../models/candidate.model').Candidate;
let globalCourse = {};
//Get /courses
router.route('/courses').get(function (req, res) {
    let sortParam;
    if (this.globalCourse == undefined) {
        this.globalCourse = {
            attribute: ""
        }
    }
    switch (this.globalCourse.attribute) {
        case "courseName":
            sortParam = {
                courseName: 'asc'
            }
            break;
        case "domainName":
            sortParam = {
                domainName: 'asc'
            }
            break;
        case "trainerName":
            console.log('trainer');
            sortParam = {
                trainerName: 'asc'
            }
            console.log(sortParam);
            break;
        case "startDate":
            sortParam = {};
            break;
        case "isActive":
            sortParam = {
                isActive: 'asc'
            }
            break;
        default:
            sortParam = {};
            break;
    };
    Course.find(function (err, courses) {
        if (err) {
            res.status(500).json(err.stack);
        }
        this.globalCourse = {};
        res.status(200).json({
            courses: courses,
            message: "SUCCESS!"
        });
    }).sort(sortParam);
});

//Get /courses/id
router.route('/courses/:id').get(function (req, res) {

    Course.findById(req.params.id, { __v: 0 }, function (err, course) {
        if (err) {
            res.status(500).json(err.stack);
        }
        res.status(200).json(course);
    });
});

//INSERT
//Post /courses
router.route('/courses').post(function (req, res) {

    let course = new Course();
    course.courseName = req.body.courseName;
    course.domainName = req.body.domainName;
    course.startDate = req.body.startDate;
    course.trainerName = req.body.trainerName;
    course.isActive = req.body.isActive;

    course.save(function (err) {
        if (err) {
            res.status(500).json(err.stack);
            return;
        }
        res.status(200).json({ message: 'Course Added Successfully' });
    });
});

//Delete /courses/1
router.route('/courses/:id').delete(function (req, res) {
    Course.deleteOne({ _id: req.params.id }, function (err, course) {
        if (err) {
            res.status(500).json(err.stack);
            return;
        }
        Candidate.find(function (err, candidates) {
            if (err) {
                res.status(500).json(err.stack);
            }
            for(var candidate of candidates) {
                let tempCourses = [];
                for(var candCourse of candidate.courses) {
                    if(!(req.params.id == candCourse._id)) {
                        tempCourses.push(candCourse);
                    }
                }
                candidate.courses = tempCourses;
                candidate.save(function (err) {
                    if (err) {
                        res.status(500).json(err.stack);
                        return;
                    }
                });
            }
         
        });
        res.status(200).json({ message: 'Course Deleted Successfully' });
    });


});

//UPDATE
router.route('/courses/:id').put(function (req, res) {
    Course.findById({ _id: req.params.id }, function (err, course) {
        if (err) {
            res.status(500).json(err.stack);
            return;
        }
        course.courseName = req.body.courseName;
        course.domainName = req.body.domainName;
        course.startDate = req.body.startDate;
        course.trainerName = req.body.trainerName;
        course.isActive = req.body.isActive;

        //  if(course.isActive == false) {
            Candidate.find(function (err, candidates) {
                if (err) {
                    res.status(500).json(err.stack);
                }
                for(var candidate of candidates) {
                    for(var candCourse of candidate.courses) {
                        if(req.params.id == candCourse._id) {
                            candCourse.isActive = course.isActive;
                            candidate.save(function (err) {
                                if (err) {
                                    res.status(500).json(err.stack);
                                    return;
                                }
                            });
                        }
                    }
                }
             
            });
        //}
        course.save(function (err) {
            if (err) {
                res.status(500).json(err.stack);
                return;
            }
            console.log('Updated Course');
            res.status(200).json({ message: 'Course Updated Successfully' });
        });
    });
});

//POST---->SORTING
router.route('/courses/sort').post(function (req, res) {
    this.globalCourse = req.body;
    res.redirect('/courses');
});

//Get Candidates associated to a particular course
router.route('/courses/getCandidates').post(function (req, res) {
    let candidatesToPush = new Candidate();
    candidatesToPush = [];

    let course = req.body.course;

    Candidate.find(function (err, candidates) {
        if (err) {
            res.status(500).json(err.stack);
        }

        for(var candidate of candidates) {
            for(var candCourse of candidate.courses) {
                if(course._id == candCourse._id) {
                    candidate.courses = "";
                    candidatesToPush.push(candidate);
                }
            }
        }
        res.status(200).json(
            {
                candidates: candidatesToPush, 
                message: 'Candidate Got!'
            });
    });
});

module.exports = router;