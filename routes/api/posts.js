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

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.send(posts);
  } catch (error) {
    handleServerError(error);
  }
});

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({
        errors: ['Not found']
      });
    }
    res.send(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        errors: ['Not found']
      });
    }
    res.status(500).send('Internal server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Deleta a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Fetch post
    const post = await Post.findById(req.params.id);
    // Check post exists
    if (!post) {
      return res.status(404).send({
        errors: ['Not found']
      });
    }
    // Check post author matches logged in user
    // ObjectID must be first converted to string!
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send({
        errors: ['Unauthorized!']
      });
    }
    // Delete post
    await post.remove();
    res.send('Post removed');
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        errors: ['Not found']
      });
    }
    res.status(500).send('Internal server error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    // Fetch post
    const post = await Post.findById(req.params.id);
    // Check post exists
    if (!post) {
      return res.status(404).send({
        errors: ['Not found']
      });
    }
    // Check logged in user has not previously liked post
    const like = post.likes.find(like => like.user.toString() === req.params.id);
    if (like) {
      res.status(401).send({
        errors: ['You already liked this post']
      });
    }
    // Add signed like to likes array
    post.likes.unshift({ user: req.params.id });
    await post.save();
    res.send(post.likes);
  } catch (error) {
    handleServerError(error);
  }
});

module.exports = router;
