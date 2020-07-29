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
const express = require('express');
const mongoose = require('mongoose');

// bring in routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;

// connect to mongoDB through mongoose
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error(err));

// test route, please ignore
app.get('/', (req, res) => res.send('Hello'));

// configure app to use the provided routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

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

`/routes/api/users.js`

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

The same for `/routes/api/posts.js` and `/routes/api/profile.js`
