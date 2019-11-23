const Admin = require('../models/admin.model');

const config = require('./config');
//Crating Strategy for JWT
// aND NOT OAUTH
module.exports = function (passport) {
    var JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;

    var options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.secretOrKey = config.secret;

    passport.use(new JwtStrategy (options, (jwt_payload, done) => {
        Admin.getAdminById(jwt_payload._id, (err, admin) => {
            if(err) return done(err,false);
            if(admin) return done(null,admin);
            else
                return done(null,false);
        })
    }))
}