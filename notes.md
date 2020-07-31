## Initialize npm

terminal:  
`npm init`

creates package.json

## Install dependencies

terminal:  
`npm i express mongoose passport-jwt jsonwebtoken body-parser bcryptjs validator`

- express: main framework
- mongoose: connect app to mongoDB
- passport-jwt: authentication
- jsonwebtoken: generate tokens
- body-parser: take in data through requests
- bcryptjs: encryption
- validator: validations

## Install dev-dependencies

terminal:  
`npm i -D nodemon`

nodemon: watches node application and update on change

## Add scripts

`/package.json`

```json
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js"
},
```

## Set up the server

`/server.js`

```jsx
// bring in express / mongoose / body-parser
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// bring in routes
const usersRoute = require('./routes/api/usersRoute');
const profileRoute = require('./routes/api/profileRoute');
const postsRoute = require('./routes/api/postsRoute');

const app = express();

// bring in body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// connect to mongoDB through mongoose
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

// test route, please ignore
app.get('/', (req, res) => res.send('Hello'));

// configure app to use the provided routes. ie: assign the file usersRoute.js to /api/users
// Although convention is to use lower case for routes (ie: 'users.js') and upper case singular ('User.js') for models,
// I prefer to use the appendix Route and Model ('usersRoute.js, UserModel.js') for clarity.
app.use('/api/users', usersRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

// production || development
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
```

## Connect to mongoDB with mongoose

`/config/keys.js`

```jsx
module.exports = {
  mongoURI:
    'mongodb+srv://<name>:<password>@devconnectorcluster.edq1v.azure.mongodb.net/<dbname>?retryWrites=true&w=majority',
};
```

## Set up routes with express router

`/routes/api/usersRoute.js`

```jsx
// users route (/routes/api/users)

// set up router
const express = require('express');
const router = express.Router();

// test route, please ignore
// @route   GET api/users/test
// @desc    Tests the route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'users route works' }));

// export the router so the server.js file can pick it up
module.exports = router;
```

The same for `/routes/api/postsRoute.js` and `/routes/api/profileRoute.js`

## Creating the user model

Sort of like a template of what data is needed to create a user

`/models/UserModel.js`

```jsx
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// User is the variable name
// TODO "users is the name we want to use" ?? I don't know what that means
module.exports = User = mongoose.model('users', UserSchema);
```

## User registration, importing gravatar and using http client Postman

`/routes/api/profileRoute.js`

terminal:  
`npm i gravatar`

```jsx

const gravatar = require('gravatar')

...

// @route   POST api/users/register
// @desc    registers a user
// @access  Public

// check if user exists by looking for existing email
// if so, return 400
// if not, create new user

router.post('/register', (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((user) => {
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
    }
  });
});
```

## Encrypt the password

`/routes/api/usersRoute`

A salt is random data that is used as an additional input to a one-way function that hashes a password.  
.genSalt takes in the N° of desired characters for the hash, and a callback.  
.genSalt returns an error if there is one, or the salt.  
.hash takes in the plaintext password, the salt and a callback.  
In the callback we check for errors, then save the new user and send the new user data in json format.

```jsx
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
```

## The story far...

- Created a UserModel, a template that determines which types of data a 'user' will be made of, using a mongoose 'Schema'.
- Created a usersRoute, a collection of functionality pertaining to a 'user' (registration, login, etc). Here we also import the UserModel.  
  Then we added the functionality to register a new user and encrypt the password using bcrypt.
- In server.js we brought in the usersRoute, connected the database to the app through mongoose, used 'app.use' to connect the 'address' (/api/users) to the 'route' (usersRoute).

## Email, password, login

`/routes/api/usersRoute.js`

- get the email and password from the request body
- find user by email (promise)
- check for user
- if no user, return 'not found' + error message
- if user, check password using bcrypt.compare(provided password, hashed password in database)
- if password match, generate token
- else return error

```jsx
// @route   POST api/users/login
// @desc    Login user / return JsonWebToken
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        res.json({ msg: 'Passwords match' });
      } else {
        return res.status(400).json({ password: 'Password does not match' });
      }
    });
  });
});
```

## creating the JWT
