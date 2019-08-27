const router = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('joi');
const { User } = require('../../models/user');
const { Profile, validateProfile } = require('../../models/profile');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Fetch user profile and add extra fields from the user document - similar to SQL join
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar'
    ]);
    if (!profile) {
      return res.status(400).send({ errors: 'There is no profile for this user' });
    }
    res.send(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

// @route   POST api/profile/me
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
  // Validate incoming data
  const result = Joi.validate(req.body, validateProfile, { abortEarly: false });
  if (result.error) {
    return res.status(422).send({
      errors: result.error.details.map(error => error.message)
    });
  }
  // Destucture data for ease of use
  const {
    handle,
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;
  // Build profile object
  const profileFields = {
    user: req.user.id
  };
  if (handle) profileFields.handle = handle;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());
  //Build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, profileFields, { new: true });
      return res.send(profile);
    }
    profile = new Profile(profileFields);
    await profile.save();
    res.send(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [
      'name',
      'avatar'
    ]);
    if (!profile) {
      return res.status(404).send({
        errors: [`No user profile found for user with id ${req.params.user_id}`]
      });
    }
    res.send(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        errors: [`No user profile found for user with id ${req.params.user_id}`]
      });
    }
    res.status(500).send('Internal server error');
  }
});

// @route   DELETE api/profile
// @desc    Delete logged in user, profile, & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // @TODO - Remove user's posts
    console.log(req.user.id);
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndRemove(req.user.id);
    res.send('User deleted');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
