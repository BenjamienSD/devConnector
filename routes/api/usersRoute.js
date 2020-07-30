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
router.post('/register', (req, res) => {
  // check if user exists by looking for existing email
  // if it exists, return 400
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
      // if not, create new user
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

      // A salt is random data that is used as an additional input to a one-way function that hashes data, a password or passphrase.
      // (N° of desired characters for the hash, callback)
      // .genSalt returns an error if there is one, or a salt
      bcrypt.genSalt(10, (err, salt) => {
        // .hash takes in the plaintext password, the salt and a callback
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // now it uses the salt to hash the password
          newUser.password = hash;
          newUser
            // .Save is mongoose
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(error));
        });
      });
    }
  });
});

// export the router so the server.js file can pick it up
module.exports = router;
