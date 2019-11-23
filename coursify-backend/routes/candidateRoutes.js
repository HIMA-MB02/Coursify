var express = require('express');
var router = express.Router();
let Candidate = require('../models/candidate.model').Candidate;
let globalCandidate = {}


//Get /candidates
router.route('/candidates').get(function (req, res) {
    let sortParam;
    if (this.globalCandidate == undefined) {
        this.globalCandidate = {
            attribute: ""
        }
    }
    switch (this.globalCandidate.attribute) {
        case "firstName":
            sortParam = {
                firstName: 'asc'
            }
            break;
        case "lastName":
            sortParam = {
                lastName: 'asc'
            }
            break;
        case "age":
            sortParam = {
                age: 'asc'
            }
            console.log(sortParam);
            break;
        default:
            sortParam = {};
            break;
    };
    Candidate.find(function (err, candidates) {
        if (err) {
            res.status(500).json(err.stack);
        }
        res.status(200).json(
            {
                candidates: candidates, 
                message: 'Candidate Sorted!'
            });
    }).sort(sortParam);
});


//Get /candidates/id
router.route('/candidates/:id').get(function (req, res) {

    Candidate.findById(req.params.id, { __v: 0 }, function (err, candidate) {
        if (err) {
            res.status(500).json(err.stack);
        }
        res.status(200).json(candidate);
    });
});

//Post INSTERT A NEW CANDIDATE
router.route('/candidates').post(function (req, res) {

    let candidate = new Candidate();
    candidate.firstName = req.body.firstName;
    candidate.lastName = req.body.lastName;
    candidate.age = req.body.age;

    for (let course of req.body.courses) {
        candidate.courses.push(course);
    }
    console.log(candidate);
    candidate.save(function (err) {
        if (err) {
            res.status(500).json(err.stack);
            return;
        }
        console.log("Added Candidate");
        res.status(200).json({ message: 'Candidate Added Successfully' });
    });
});

//UPDATE
router.route('/candidates/:id').put(function (req, res) {

    Candidate.findById({ _id: req.params.id }, function (err, candidate) {
        if (err) {
            res.status(500).json(err.stack);
            return;
        }
        candidate.firstName = req.body.firstName;
        candidate.lastName = req.body.lastName;
        candidate.age = req.body.age;
        candidate.courses = [];
        for (let course of req.body.courses) {
            candidate.courses.push(course);
        }
        candidate.save(function (err) {
            if (err) {
                res.status(500).json(err.stack);
                return;
            }
            console.log('Updated Candidate!');
            res.status(200).json({ message: 'Candidate Updated Successfully' });
        });
    });
});

//Delete /courses/1
router.route('/candidates/:id').delete(function (req, res) {
    Candidate.deleteOne({ _id: req.params.id }, function (err, candidate) {
        if (err) {
            res.status(500).json(err.stack);
            return;
        }
        console.log('Deleted Candidate');
        res.status(200).json({ message: 'Course Deleted Candidate' });
    });
});

//POST---->SORTING
router.route('/candidates/sort').post(function (req, res) {
    console.log(req.body);
    this.globalCandidate = req.body;
    res.redirect('/candidates');
});


module.exports = router;