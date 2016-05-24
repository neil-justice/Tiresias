// Express server

// Load the web-server, file-system and file-path modules.
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

// MongoDB setup
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/tiresias';
var database, predictions;

ObjectID = require('mongodb').ObjectID;

MongoClient.connect(url, function(err, db) {
    database=db;
    predictions = database.collection('predictions');
    console.log("Connected correctly to server.");
});

// Mongoose setup
mongoose.connect(url);

var userSchema = new mongoose.Schema( {
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    hash: String,
    salt: String,
    successCount: Number,
    failCount: Number,
    admin: Boolean
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

userSchema.methods.isValidPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
}

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, fs.readFileSync('config/secret.txt'));
};

var User = mongoose.model('User', userSchema);

// Express setup
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

// app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));
app.use(express.static("bower_components"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
router.route('/api/predictions').get(function(req, res, next) {

        // Get all the documents in the collection
    predictions.find().toArray(function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data); // Already an array
        }
    });
});


router.route('/api/predictions/').post(function(req, res) {

    if (!verifyUser(req.body.token, req.body.user)) {
        return res.status(403).json({success: false, message: 'authorisation failed - please log in'});
    }
    // Insert the body of the request into the db as a new document
    predictions.insertOne(req.body, function(err, result) {

        if (err) {
            res.json({message: "Failure"});
        } else {
            // Return the result given by mongoDB after the Insert operation
            // This is the object that was inserted as it exists in the db
            res.json(result.ops[0]);
        }
    });
});

router.route('/api/predictions/:pid')
    .get(function(req, res) {

        // Invalid pid length
        if (req.params['pid'].length != 24) {
            res.sendStatus(404);
        }

        predictions.find({"_id": new ObjectID(req.params['pid'])}).toArray(function(err, data) {
            if (err) {
                console.log(err);
            }
            else {

                // Returned document is empty
                if (!data[0]) {
                    res.sendStatus(404);
                }
                else
                    res.send(data[0]);
            }
        });
});

router.route('/api/vote').post(function(req, res) {
    var data = req.body;
    var vote = data.vote;
    var id = data._id;
    var currentUser = data.currentUser;
    var token = data.token;

    if (!data || !id || !token || !currentUser) {
        return res.sendStatus(400);
    }

    // Get user information from the token (needs secret code that we generated randomly to decode it)
    if (!verifyUser(token, currentUser.username)) {
        return res.status(403).json({success: false, msg: 'authorisation failed - please log in'});
    }

    // Increment by 1 or -1 depending on whether it was an upvote or a downvote
    var inc = vote ? 1 : -1;

    // Find whether that user has upvoted or downvoted this prediction before
    var findParams = {
        _id: new ObjectID(id),
        $or: [
            {
                upvotes: {$in: [currentUser.username]}
            },
            {
                downvotes: {$in: [currentUser.username]}
            }]
    };

    predictions.predictionsne(findParams, function(err, result) {
        if (err) {
            return res.sendStatus(500);
        }

        var updateParams = {};

        // If user has not voted on this before
        if (result === null) {

            // Update vote and add their username to upvotes or downvotes array inside prediction
            updateParams ={$inc: {votes: inc}};

            if (vote) {
                updateParams.$addToSet = {upvotes: currentUser.username};
            } else {
                updateParams.$addToSet = {downvotes: currentUser.username};
            }

            // Do the update
            predictions.update({ _id: new ObjectID(id) }, updateParams, function(err, result) {
                if (err) {
                    return res.sendStatus(500);
                } else {
                    var returnObj = {inc: inc, hasVoted: true};
                    return res.json(returnObj);
                }
            });
        }
        else {
            return res.status(403).json({inc:0, hasVoted: true})
        }

    });
});

router.post('/api/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, message: 'Please enter a username and a password'});
    } else {
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            successCount: 0,
            failCount: 0
        });
        newUser.setPassword(req.body.password);

        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, message: 'Username already exists'});
            }
            else {
                res.json({success: true, message: 'Successful created new user'});
            }
        });
    }
});

router.post('/api/login', function(req, res) {

    if (!req.body.username || !req.body.password) {
        return res.status(403).json({success: false, message: 'no data provided'});
    }

    // Check to see if the user trying to login exists.
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json({success: false, message: 'no such user'});;
        }
        else if (!user.isValidPassword(req.body.password)) {
            return res.status(400).json({success: false, message: 'incorrect password'});;
        }
        else { // User exists
            // Generate token and send it back
            var token = user.generateJwt();
            return res.status(200).json({token: token});
        }
    });
});

router.post('/api/decode', function(req, res) {

    if (!req.body.token) {
        return res.status(403).json({success: false, message: 'No token provided.'});
    }

    // Get user information from the token (needs secret code that we generated randomly to decode it)
    var decodedToken = decodeJWT(req.body.token);

    if (!decodedToken.username) {
        return res.status(403).json({success: false, msg: 'No user found in token'});
    }

    User.findOne({
        username: decodedToken.username
    }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json({success: false, message: 'no such user'});;
        }
        else if (decodedToken.exp < Date.now() / 1000) {
            return res.status(400).json({success: false, message: 'token expired'});;
        }
        else {
            return res.status(200).json({username: user.username,
                                         email: user.email,
                                         successCount: user.successCount,
                                         failCount: user.failCount,
                                         admin: user.admin });
        }
    });
});

// post a comment on a prediction.  has server-side verification.
router.route('/api/comment').post(function(req, res) {
    var data = req.body;
    var text = data.text;
    var currentUser = data.currentUser;
    var id = data._id;
    var token = data.token; // for authentication

    if (!id || !text || text == "" || !currentUser || !token) {
        return res.status(400);
    }

    // Get user information from the token (needs secret code that we generated randomly to decode it)
    if (!verifyUser(token, currentUser)) {
        return res.status(403).json({success: false, msg: 'authorisation failed - please log in'});
    }

    var comment = { username: currentUser, body: text };

    predictions.update({ _id: new ObjectID(id) }, { $addToSet: { comments: comment} }, function(err, result) {

        if (err) {
            return res.sendStatus(500);
        } else {
            return res.json(result);
        }

    });
});

// Allows setting whether prediction came true or not
router.route('/api/setFinishedState').post(function(req, res) {
    var data = req.body;
    var username = data.username;
    var id = data._id;
    var token = data.token; // for authentication
    var state = data.finishedState;

    if (!id || !username || !token) {
        return res.status(400);
    }

    // Get user information from the token (needs secret code that we generated randomly to decode it)
    if (!verifyUser(token, username)) {
        return res.status(403).json({success: false, msg: 'authorisation failed - please log in'});
    }

    predictions.update({ _id: new ObjectID(id) }, { $set: { finishedState: state} }, function(err, result) {

        if (err) {
            return res.sendStatus(500);
        } else {

            var upvotes, downvotes;

            collection.findOne({_id: new ObjectID(id)}, function(err, prediction) {

                if (err) {
                    throw err;
                }

                upvotes = prediction.upvotes;
                downvotes = prediction.downvotes;

                updateStats(upvotes, downvotes, state);
            });


            return res.json();
        }

    });
});

router.route('/*').get(function(req, res) {

    var options = {
      root: __dirname,
      dotfiles: 'deny',
      headers: {}
    };
    sendAsXHTML(req, options);

    res.sendFile('/views/index.html', options);
});

app.use('/', router);
app.listen(8081);

function sendAsXHTML(req, options) {

    if (req.accepts('application/xhtml+xml') ) {
        options.headers = { 'Content-Type': 'application/xhtml+xml' };
    }
    else {
       options.headers = { 'Content-Type': 'text/html' };
    }
}

function decodeJWT(token) {
    if (!token) throw err;

    return jwt.decode(token, fs.readFileSync('config/secret.txt'));
}

function verifyUser(token, username) {
    // Get user information from the token (needs secret code that we generated randomly to decode it)
    var decodedToken = decodeJWT(token);

    if (!decodedToken.username || decodedToken.username !== username) {
        console.log(username + ' != ' + decodedToken.username);
        return false;
    }
    else {
        return true;
    }
}

function updateStats(upvotes, downvotes, success) {
    var filter, updateParams;

    if (success) {
        filter = {username: {$in: upvotes}};
        updateParams = {$inc: {successCount: 1}};
    } else {
        filter = {username: {$in: downvotes}};
        updateParams = {$inc: {successCount: 1}};
    }

    User.update(filter, updateParams, function(err, result) {
        if (err) {throw err;}
    });

    if (success) {
        filter = {username: {$in: downvotes}};
        updateParams = {$inc: {failCount: 1}};
    }
    else {
        filter = {username: {$in: upvotes}};
        updateParams = {$inc: {failCount: 1}};
    }

    User.update(filter, updateParams, function(err, result) {
        if (err) {throw err;}
    });
}
