//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
const mongoose = require('mongoose');
const PORT = 3000;
const config = require('./db/config');
var courseRoutes = require('./routes/courseRoutes');
var candidateRoutes = require('./routes/candidateRoutes');
var jwtRoutes =  require('./routes/jwtRoutes')
var morgan = require('morgan');
const fs = require('fs');
//For JWT
var passport = require('passport');
var myPassportService = require('./db/passport')(passport);


mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

//When Connection is Open
db.once('open', function () {
    console.log('MONGODB Connection Open at ' + config.DB);
});

//Check DB for error
db.on('error', function (err) {
    console.log("Error is: " + err.stack);
})

//Configure Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, './public/data/access.log'), {flags: 'a'})
}))
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());


//Use External Routes
app.use('/login', jwtRoutes);
app.use('/', courseRoutes);
app.use('/', candidateRoutes);

//Start the Server
app.listen(PORT, function() {
    console.log('Server Started at PORT: ' + PORT);
});