const router = require('express').Router();
const auth = require('../../middleware/auth');
const { User } = require('../../models/user');
const { Profile } = require('../../models/profile');

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
    console.log(profile);
    if (!profile) {
      return res.status(400).send({ errors: 'There is no profile for this user' });
    }
    res.send(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
