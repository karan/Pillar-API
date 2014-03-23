var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId
var User = require('./../models/user');
var Message = require('../models/message.js');
var request = require('request');

/*
 * Sign up a user.
 */
exports.signup = function(req, res){
    // get the form values from "name" attribute of the form
    var user = new User({
        'username': req.body.username
    });

    console.log('signing up ' + user.username);

    user.save(function(err) {
        if (err) {
            // TODO make it works for the plugin I'm using
            console.log('got into error');
            if (err.code == 11000) {
                console.log('\n----' + err + '---');
                res.json({
                    'response': 'FAIL',
                    'errors': ["User already exists"]
                });
            } else {
                console.log(err);
                var fail_msgs = [];
                for (var field in err.errors) {
                    fail_msgs.push(err.errors[field].message);
                }
                res.json({
                    'response': 'FAIL',
                    'errors': fail_msgs
                });
            }
        } else {
            // successful registration
            res.json({
                'response': 'OK',
                'user': user
            });
        }
    });
};

/*
 * Sign in a user
 */
exports.signin = function(req, res) {
    var username = req.body.username;

    console.log('signing in ' + username);

    User.findOne( {username: username}, function(err, user) {
        if (!user) {
            res.json({
                    'response': 'FAIL',
                    'errors': ['User not found']
                });
        } else {
            console.log(user);
            // save the user in sessions to be retrieved later
            req.session.user = user;   
            // successful registration
            res.json({
                'response': 'OK',
                'user': user
            });
        }
    });
};

/*
 * Add a new score for the logged in user.
 */
exports.addscore = function(req, res) {
    User.update(
        {'username': req.session.user.username},
        { $push: { 
            scores: {'score': +req.body.score} 
        } }, 
        function(err) {
        if (err) console.log(err);

        User.findOne({'username': req.session.user.username}, function(err, user) {
            res.json({
                'response': 'OK',
                'user': user
            });
        });
    });
};

/*
 * Add a new message for the logged in user.
 */
exports.addmessage = function(req, res) {

    var message = new Message({
        message: req.body.message,
        username: req.session.user.username
    });

    message.save(function(err) {
        if (err) {
            console.log(err);
            var fail_msgs = [];
            for (var field in err.errors) {
                fail_msgs.push(err.errors[field].message);
            }
            res.json({
                'response': 'FAIL',
                'errors': fail_msgs
            });
        } else {
            // successful registration
            res.json({
                'response': 'OK',
                'message': message
            });
        }
    });
}

/*
 * Get all messages posted by the logged in user
 */
exports.getMyMessages = function(req, res) {
    Message.find( {'username': req.session.user.username}, function(err, messages) {
        if (err) console.log(err);

        res.json({
                'response': 'OK',
                'messages': messages
        });
    });
}

/*
 * get all messages on the network except those by logged in user
 */
exports.getAllMessages = function(req, res) {
    Message.find().where('username').ne(req.session.user.username)
                .sort('-created_at').exec(function(err, messages) {
        if (err) console.log(err);

        res.json({
                'response': 'OK',
                'messages': messages
        });
    });
}

/*
 * Get a random quote from the bible
 */
exports.getQuote = function(req, res) {
    var start = Math.floor(Math.random() * 6) + 1; // start page for search
    var index = Math.floor(Math.random() * 15); // index of array to get from result
    var url = "http://api.biblia.com/v1/bible/search/LEB.js?query=life&mode=verse&start="+start+"&limit=20&key=fd37d8f28e95d3be8cb4fbc37e15e18e"

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var response = JSON.parse(body);

            res.json({
                'response': 'OK',
                'quote': response['results'][index]
            });
        }
    });
}

/*
 * post a message to the current message, can be a quote or a custom message
 */
exports.sendmessage = function(req, res) {
    var messageID = req.body.messageID;
    var message = req.body.message;
    var title = req.body.messageTitle || '';

    Message.update(
        {'_id': messageID},
        { $push: { 
            replies: {
                'message': message,
                'title': title,
            } 
        } }, 
        function(err) {
        if (err) console.log(err);

        Message.findOne({'_id': messageID}, function(err, message) {
            res.json({
                'response': 'OK',
                'message': message
            });
        });
    });
}

/*
 * get details of a given message id
 */
exports.getMessage = function(req, res) {
    var messageID = req.query.messageID;
    Message.findOne({'_id': messageID}, function(err, message) {
        res.json({
            'response': 'OK',
            'message': message
        });
    });
}
