const User = require("../models/User");

// @desc    Get user profile data
// @route   GET /api/users/profile
// @access  Private (requires token)
exports.getUserProfile = async (req, res) => {
  // The user object is attached to the request in the 'protect' middleware
  // We can be sure req.user exists because the middleware ran successfully
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile data
// @route   PUT /api/users/profile
// @access  Private (requires token)
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update the user object with data from the request body
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.institute = req.body.institute ?? user.institute;
    user.bio = req.body.bio ?? user.bio;
    user.location = req.body.location ?? user.location;
    user.skills = req.body.skills || user.skills;
    
    if (req.body.platforms) {
      user.platforms = req.body.platforms;
    }
    
    // Note: Avatar uploads are typically handled differently (e.g., with multer)
    // For now, we assume a URL is passed in the body.
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }
    
    const updatedUser = await user.save();
    
    res.status(200).json(updatedUser);

  } else {
    res.status(404).json({ message: "User not found" });
  }
};