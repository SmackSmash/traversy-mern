const router = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('joi');
const { User } = require('../../models/user');
const {
  Profile,
  validateProfile,
  validateExperience,
  validateEducation
} = require('../../models/profile');

const handleError = error => {
  console.error(error);
  res.status(500).send('Internal server error');
};

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
    handleError(error);
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
    handleError(error);
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
    handleError(error);
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
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndRemove(req.user.id);
    res.send({ msg: 'User deleted' });
  } catch (error) {
    handleError(error);
  }
});

// @route   PUT api/profile/experience
// @desc    Update profile experience
// @access  Private
router.put('/experience', auth, async (req, res) => {
  // Validate request data
  const result = Joi.validate(req.body, validateExperience, { abortEarly: false });
  if (result.error) {
    return res.status(422).send({
      errors: result.error.details.map(error => error.message)
    });
  }
  // Reassign data for readability
  const experience = { ...req.body };
  try {
    // Check user profile exists
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).send({
        errors: ['User profile does not exist']
      });
    }
    // Add experience data
    profile.experience.unshift(experience);
    await profile.save();
    res.send(profile);
  } catch (error) {
    handleError(error);
  }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete an experience entry
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Check experience entry exists
    const experienceEntry = profile.experience.find(entry => entry.id === req.params.exp_id);
    if (!experienceEntry) {
      return res.status(400).send({
        errors: [`No experience entry exists with that ID`]
      });
    }
    // Filter out the desired experience entry
    profile.experience = profile.experience.filter(entry => entry.id !== req.params.exp_id);
    await profile.save();
    res.send(profile);
  } catch (error) {
    handleError(error);
  }
});

// @route   PUT api/profile/education
// @desc    Update profile education
// @access  Private
router.put('/education', auth, async (req, res) => {
  // Validate incoming data
  const result = Joi.validate(req.body, validateEducation, { abortEarly: false });
  if (result.error) {
    return res.status(422).send({
      errors: result.error.details.map(error => error.message)
    });
  }
  // Reassign data for readability
  const education = { ...req.body };
  try {
    // Check user profile exists
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(422).send({
        errors: ['User profile does not exist']
      });
    }
    // Add experience data
    profile.education.unshift(education);
    await profile.save();
    res.send(profile);
  } catch (error) {
    handleError(error);
  }
  res.send('Success!');
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete an education entry
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Check education entry exists
    const educationEntry = profile.education.find(entry => entry.id === req.params.edu_id);
    if (!educationEntry) {
      return res.status(422).send({
        errors: [`No education entry exists with that ID`]
      });
    }
    // Filter out the desired education entry
    profile.education = profile.education.filter(entry => entry.id !== req.params.edu_id);
    await profile.save();
    res.send(profile);
  } catch (error) {
    handleError(error);
  }
});

module.exports = router;
