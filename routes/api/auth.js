const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { User, validateSignIn } = require('../../models/user');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

// @route   POST api/auth
// @desc    Sign In User
// @access  Public
router.post('/', async (req, res) => {
  // Validate request data
  const result = Joi.validate(req.body, validateSignIn, { abortEarly: false });
  if (result.error) {
    return res.status(422).send({
      errors: result.error.details.map(error => error.message)
    });
  }
  // Destructure data for ease of use
  const { email, password } = req.body;
  try {
    // Check user exists and extract data
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        errors: [`No user with email ${email} exists in database`]
      });
    }
    // Check passwords match
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).send({
        errors: [`Passwords do not match`]
      });
    }
    // Create JWT and send to user
    const payload = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 });
    res.send({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
