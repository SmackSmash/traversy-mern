const router = require('express').Router();
const Joi = require('joi');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validateSignUp } = require('../../models/user');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', async (req, res) => {
  const result = Joi.validate(req.body, validateSignUp, { abortEarly: false });
  if (result.error) {
    return res.status(422).send({ errors: result.error.details.map(error => error.message) });
  }

  const { name, email, password } = req.body;
  try {
    // Check user exists
    let user = await User.findOne({ email });
    if (user) return res.status(422).send({ errors: [`User with email ${email} already exists`] });
    // Get user's gravatar
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
    // Encrypt password with 10 salt rounds
    const encrypted = await bcrypt.hash(password, 10);
    // Return JWT
    user = new User({
      name,
      email,
      avatar,
      password: encrypted
    });
    await user.save();
    // Generate JWT
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
