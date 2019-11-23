var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

let AdminSchema = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: String
});

const Admin = mongoose.model('admins', AdminSchema);

var addAdmin = function (newAdmin, callback) {
    //Encryption Logic
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;

            newAdmin.password = hash;
            newAdmin.save(callback);
        })
    })
}

//Now i can user User.getUserByUserName() in user.routes.js
var getAdminByEmail = function (email, callback) {
    const query = { email: email };
    Admin.findOne(query, callback);
}

//Can be done in the same function
//BUT BEST PRACTICE NAHI HAI
//Now i can user User.comparePassword() in user.routes.js
var comparePassword = function (adminPassword, hash, callback) {
    bcrypt.compare(adminPassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

var getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

module.exports = {
    getAdminByEmail: getAdminByEmail,
    comparePassword: comparePassword,
    getAdminById: getAdminById,
    addAdmin: addAdmin,
    Admin: Admin
}
