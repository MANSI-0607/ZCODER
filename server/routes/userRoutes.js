const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware"); // Import your middleware

// Define the profile route. Both GET and PUT requests to '/profile'
// will first run the 'protect' middleware.
router
  .route("/profile")
  .get(protect, getUserProfile)      // Handles fetching the profile data
  .put(protect, updateUserProfile); // Handles updating the profile data

module.exports = router;