// profile route (/routes/api/profile)

// set up router
const express = require('express');
const router = express.Router();

// test route, please ignore
// @route   GET api/profile/test
// @desc    Tests the route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'profile route works' }));

// export the router so the server.js file can pick it up
module.exports = router;
