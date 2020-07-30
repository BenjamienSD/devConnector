## initialize npm

`npm init`

creates package.json

## install dependencies

`npm i express mongoose passport-jwt jsonwebtoken body-parser bcryptjs validator`

- express: main framework
- mongoose: connect app to mongoDB
- passport-jwt: authentication
- jsonwebtoken: generate tokens
- body-parser: take in data through requests
- bcryptjs: encryption
- validator: validations

## install dev-dependencies

`npm i -D nodemon`

nodemon: watches node application and update on change

## add script

`/package.json`

```json
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js"
},
```

## set up server

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

// configure app to use the provided routes
app.use('/api/usersRoute', usersRoute);
app.use('/api/profileRoute', profileRoute);
app.use('/api/postsRoute', postsRoute);

// production || development
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
```

## connect to mongoDB with mongoose

`/config/keys.js`

```jsx
module.exports = {
  mongoURI:
    'mongodb+srv://<name>:<password>@devconnectorcluster.edq1v.azure.mongodb.net/<dbname>?retryWrites=true&w=majority',
};
```

## set up routes with express router

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

## creating the user model

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

// User is the variable
// TODO users is the name we want to use ??
module.exports = User = mongoose.model('users', UserSchema);
```

## User registration, http client Postman

`/routes/api/profileRoute.js`

## import gravatar

`npm i gravatar`

```jsx

const gravatar = require('gravatar')

...

// @route   POST api/users/register
// @desc    registers a user
// @access  Public
router.post('/register', (req, res) => {
  // check if user exists by looking for existing email
  // if so, return 400
  UserModel.findOne({ email: req.body.email }).then((user) => {
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
    }
  });
});
```

## encrypt the password
