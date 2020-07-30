// entry point
//////////////

const express = require('express');
const mongoose = require('mongoose');

// bring in routes
const users = require('./routes/api/usersRoute');
const profile = require('./routes/api/profileRoute');
const posts = require('./routes/api/postsRoute');

const app = express();

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
app.use('/api/usersRoute', users);
app.use('/api/profileRoute', profile);
app.use('/api/postsRoute', posts);

// production || development
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
