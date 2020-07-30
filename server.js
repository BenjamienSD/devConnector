// entry point
//////////////
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
app.use('/api/users', usersRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

// production || development
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
