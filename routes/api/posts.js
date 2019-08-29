const router = require('express').Router();
const Joi = require('joi');
const auth = require('../../middleware/auth');
const { Post, validatePost } = require('../../models/post');
const { User } = require('../../models/user');
const { Profile } = require('../../models/profile');
const handleServerError = require('../../utils/handleServerError');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  // Validate incoming data
  const response = Joi.validate(req.body, validatePost, { abortEarly: false });
  if (response.error) {
    return res.status(422).send({
      errors: response.error.details.map(error => error.message)
    });
  }
  try {
    // Fetch user data to add to post
    const { name, avatar } = await User.findById(req.user.id).select('-password');
    // Build and save post
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name,
      avatar
    });
    const post = await newPost.save();
    res.send(post);
  } catch (error) {
    handleServerError(error);
  }
});

module.exports = router;
