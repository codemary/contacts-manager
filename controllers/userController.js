const { User } = require('../models/user');

let createError = require('http-errors');
let jwt = require('jsonwebtoken');
const config = require('../config');

const authErr = createError(401, "Authentication Required")

function user(req, res) {
    res.send(req.user)
}

function loginUser(req,res,next){
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password){
        next(authErr)
    }

    try {
        // find user by username
        User.findOne({
          username: username
        }, function (err, user) {
          if (err) {
            return next(authErr)
          }
    
          if (!user) {
           
            return next(authErr)
          }
    
          if (user.password === password) {
            
            let token = jwt.sign(
                {
                    username: username,
                    _id: user._id
                },
                config.secret,
                { expiresIn: '24h'}
              );
              // return the JWT token for the future API calls
              res.json({token: token});
          } else {
            return next(authErr) // error
          }
    
        })
    
      } catch (err) {
        console.log(err)
        return next(authErr)
      }
}

function signupUser(req, res, next) {

    let user = req.body; // body is json object due to express.json() middleware

    if (!user.username || !user.password || !user.name) {
        next(createError(400, "required missing fields: username, name, password"))
    }
    // validation
    if (user.username.length < 3 || user.username.length > 20) {
        next(createError(400, "username length must be between 3 and 20"))
    }

    let rawUser = {
        username: user.username.trim(), // sanitize
        name: user.name.trim(),
        password: user.password.trim()
    }

    try {

        User.create(rawUser, function (err, doc) {
            if (err) {
                let msg = "Internal Server Error";
                let status = 500;

                if (err.errmsg && err.errmsg.includes("E11000 duplicate key error")) {
                    msg = `error: username ${user.username} already exists`
                    status = 409; // Conflict
                }
                res.status(status);
                res.send(msg);
                return;
            }

            res.send(doc);
        });

    } catch (e) {
        console.log(e)
        next(createError(500, "Unexpected error!"))
    }
}

function deleteuser(req, res) {
    try {
        User.deleteOne({
            username: res.locals.user.username
        }, function (err, user) {
            if (err) {
                next(createError(500, "error deleting user"))
            }
            res.send(user);
        })
    } catch (err) {
        next(createError(500,err))
    }

}

function putuser(req, res, next) {

    if (!req.body.name) {
        res.send(res.locals.user)
        return;
    }

    if (req.body.name < 3) {
        next(createError(400, "name should be atleast 3 characters"))
    }


    User.updateOne({
        username: res.locals.user.username
    }, {
        name: req.body.name
    }, function (err, user) {
        if (err) {
            next(createError(500, "Unexpected error!"));
            console.log("Run::::::");

        }
        res.send({
            name: req.body.name,
            username: res.locals.user.username
        });
    })
}


module.exports = {
    user: user,
    signupUser: signupUser,
    loginUser: loginUser,
    deleteuser: deleteuser,
    putuser: putuser
}