// users route (/routes/api/users)

// bring in UserModel and assign the template to the constant 'User'
const User = require('../../models/UserModel');

// set up router
const express = require('express');
const router = express.Router();

// bring in gravatar
const gravatar = require('gravatar');

// bring in bcrypt
const bcrypt = require('bcryptjs');

// test route, please ignore
// @route   GET api/users/test
// @desc    Tests the route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'users route works' }));

// @route   POST api/users/register
// @desc    registers a user
// @access  Public

// check if user exists by looking for existing email
// if it exists, return invalid request
// if not, create new user
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm', // default: icon
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      // encrypt the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(error));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login user / return JsonWebToken
// @access  Public
router.post('/login', (req, res) => {
  // get the email and password from the request body
  const email = req.body.email;
  const password = req.body.password;
  // find user by email (promise)
  User.findOne({ email }).then((user) => {
    // if no user, return 'not found' + error message
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }
    // if user, check password using bcrypt.compare(provided password, hashed password in database)
    bcrypt.compare(password, user.password).then((isMatch) => {
      // if password match, generate token
      if (isMatch) {
        res.json({ msg: 'Passwords match' });
      } else {
        // else return error
        return res.status(400).json({ password: 'Password does not match' });
      }
    });
  });
});

// export the router so the server.js file can pick it up
module.exports = router;
