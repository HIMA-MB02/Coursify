//For Routes
const express = require('express');
const router = express.Router();
//For Web Token
const jwt = require('jsonwebtoken');
const passport = require('passport');
const AdminSchema = require('../models/admin.model');
const config = require('../db/config');
const Admin = AdminSchema.Admin;
const fs = require('fs');
const nodemailer = require('nodemailer');
let email = {};
let globalAttribute = {};
var dateFormat = require('dateformat');
var schedule = require('node-schedule');
//MILLISECONDS IN A DAY
const TOTAL_MILLISECONDS_IN_A_DAY = 60000 * 24;

//approve admin
router.route('/approveAdmin').post(function (req, res) {
    let credentials = {};
    credentials.to = req.body.to;
    credentials.role = req.body.role;
    credentials.timestamp = new Date();
    var secretKeys;
    fs.readFile('public/data/secretKeys.json', 'UTF-8', function (err, chunk) {
        if (err) {
            res.status(500).json({ message: "Read Failed!" })
        }
        secretKeys = chunk;
        secretKeys = JSON.parse(secretKeys);
        let tempRole;
        if (credentials.role === 'Course Administrator') {
            credentials.OTP = secretKeys.courseKey;
            tempRole = "COURSE_ADMIN";

        } else if (credentials.role === 'Candidate Administrator') {
            credentials.OTP = secretKeys.candidateKey;
            tempRole = "CANDIDATE_ADMIN";
        }
        this.email = credentials;
        credentials.role = tempRole;
        //Write Contents of this.toBeApproved to a file

        fs.readFile('public/data/approvals.json', 'UTF-8', function (err, chunk) {
            if (err) {
                res.status(500).json({ message: "Read Failed!" })
            }
            data = chunk;
            data = JSON.parse(data);
            let array = data;
            array.push(credentials);
            console.log(array)
            fs.writeFile('public/data/approvals.json', JSON.stringify(array), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });
        res.redirect('/login/sendEmail');
    });

})

//Sending the OTP through email
router.route('/sendEmail').get(function (req, res) {

    let emailAccount = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'himanshu.ganpa@gmail.com', // generated ethereal user
            pass: 'Appleipad8' // generated ethereal password
        }
    });
    emailAccount.sendMail({
        from: 'himanshu.ganpa@gmail.com', // sender address
        to: this.email.to, // Array of recievers
        subject: "OTP to Register on Coursify!", // Subject line
        html: `
        Dear Admin, <br/> <br/> 
        Congratulations! Your profile has been approved as a ${this.email.role}!<br />
        Please find the OTP: <b>${this.email.OTP}</b> to complete your registeration on the website. <br/><br/>
        Regards and Thanks!<br />
        Team Coursify`
    }, (error, info) => {
        if (error) {
            console.log(error);
            res.json(error);
        }
        console.log("email has been sent");
    });
    this.email = {};
    res.redirect('/login/setKeys');
});

router.route('/setKeys').get(function (req, res) {
    let data;
    fs.readFile('public/data/secretKeys.json', 'UTF-8', function (err, chunk) {
        if (err) {
            res.status(500).json({ message: "Read Failed!" })
        }
        data = chunk;
        data = JSON.parse(data);

        //Randomize the Keys
        data.courseKey = (Math.random().toString(36).substring(7)).toUpperCase();
        data.candidateKey = (Math.random().toString(36).substring(7)).toUpperCase();
        fs.writeFile('public/data/secretKeys.json', JSON.stringify(data),
            function (err) {
                if (err) {
                    res.status(500).json({ err: "Data not Saved!" })
                    return;
                }
                res.status(200).json({ message: "Admin Approved Successfully!" });
            })
    });

});

//get admins
router.route('/').get(function (req, res) {
    let sortParam;
    if (this.globalAttribute == undefined) {
        this.globalAttribute = {
            attribute: ""
        }
    }
    switch (this.globalAttribute.attribute) {
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
        case "email":
            sortParam = {
                email: 'asc'
            }
            break;
        case "role":
            sortParam = {
                role: 'asc'
            };
            break;
        default:
            sortParam = {};
            break;
    };
    Admin.find(function (err, admins) {
        if (err) {
            res.status(500).json(err.stack);
        }
        var administrators = [];
        let temp = {};
        for (var admin of admins) {
            temp._id = admin._id;
            temp.email = admin.email;
            temp.firstName = admin.firstName;
            temp.lastName = admin.lastName;
            temp.role = admin.role;
            administrators.push(temp);
            temp = {};
        }
        res.status(200).json({
            administrators: administrators,
            message: "SUCCESS!"
        });
    }).sort(sortParam);
});

let tempAdmin = {};
//REGISTER ADMIN
router.route('/register').post(function (req, res) {
    let newAdmin = new Admin({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role
    });
    fs.readFile('public/data/approvals.json', 'UTF-8', function (err, chunk) {
        if (err) {
            res.status(500).json({ message: "Read Failed!" })
        }
        data = chunk;
        data = JSON.parse(data);

        for (admin of data) {
            if ((req.body.email == admin.to) && (req.body.secretKey == admin.OTP) && (req.body.role == admin.role)) {
                let temp = [];

                for (var item of data) {
                    if (item.to !== admin.to) {
                        temp.push(item);
                    }
                }
                fs.writeFile('public/data/approvals.json', JSON.stringify(temp),
                    function (err) {
                        if (err) {
                            console.log('Credentials have not been updated!')
                            return;
                        }
                        console.log('Credentials Updated!')
                    })
                    this.tempAdmin = newAdmin;
                    res.redirect('/login/addAdmin');
                AdminSchema.addAdmin(newAdmin, (err, admin) => {
                    if (err) {
                        res.json({ success: false, msg: 'Falied to SAVE' });
                    }
                    else {
                        res.json({ success: true, msg: 'Administrator has been registered!' });
                    }
                })
            }
        }
    });

});

router.route('/addAdmin').get( function (req, res) {
         AdminSchema.addAdmin(this.tempAdmin, (err, admin) => {
                    if (err) {
                        res.json({ success: false, msg: 'Falied to SAVE' });
                    }
                    else {
                        res.json({ success: true, msg: 'Administrator has been registered!' });
                    }
                })
})

//LOGIN ADMIN
router.post('/', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    //Checking the Username is there in db
    AdminSchema.getAdminByEmail(email, (err, admin) => {
        console.log(admin);
        console.log("admin");
        if (err) throw err;
        if (!admin)
            return res.json({ success: false, msg: 'Admin Not Found' });
        //Checking the Password for that username is there in db
        //user.password is coming from db
        AdminSchema.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(admin.toObject(), config.secret, { expiresIn: 200 });
                //secret is coming from config file
                res.json({
                    success: true,
                    token: 'JWT ' + token,   //MUST HAVE JWT AND THE SPACE
                    admin: {
                        id: admin._id,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        email: admin.email,
                        role: admin.role
                    }
                });
            }
            else {
                return res.json({
                    success: false,
                    msg: 'Wrong Password'
                });
            }
        });
    });

});

//SORT
router.route('/sort').post(function (req, res) {
    this.globalAttribute = req.body;
    res.redirect('/login/');
});

//delete administrator
router.route('/:id').delete(function (req, res) {
    Admin.deleteOne({ _id: req.params.id }, function (err, admin) {
        if (err) {
            res.status(500).json(err.stack);
            return;
        }
        res.status(200).json({ message: "Deleted Successfully!" });
    })
})

//SCHEDULE JOB AT MIDNIGHT
schedule.scheduleJob({ hour: 00, minute: 00 }, function () {
    let currentDate = new Date();
    fs.readFile('public/data/approvals.json', 'UTF-8', function (err, chunk) {
        if (err) {
            res.status(500).json({ message: "Read Failed!" })
        }
        data = chunk;
        data = JSON.parse(data);
        let temp = [];
        for (admin of data) {
            var difference = currentDate - admin.timestamp;
            if (Math.floor(difference / TOTAL_MILLISECONDS_IN_A_DAY) < 1) {
                temp.push(admin);
            }
        }
        fs.writeFile('public/data/approvals.json', JSON.stringify(temp), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
});

module.exports = router;