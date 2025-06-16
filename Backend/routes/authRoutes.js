


const express = require('express');
const router = express.Router();
const {
  login,
  register,
  logout,
  updateProfile, 
  getUserProfile,
  getUserDetails,
  getFacultyDetails,
  getEligibleUsers,
  searchUsers,
  updateProfilePicture,
  getAllUsers
} = require('../Controller/authController');

const { auth, authorize } = require('../middleware/authMiddleware');
const { handleProfilePictureUpload } = require('../middleware/uploadMiddleware'); 

router.post('/register', register);
router.post('/login', login);

router.post('/logout', auth, logout);
router.get('/profile', auth, authorize(['member', 'superAdmin', 'clubAdmin', 'facultyCoordinator']), getUserProfile);
router.put('/update-profile', auth, authorize(['member', 'superAdmin', 'clubAdmin', 'facultyCoordinator']), updateProfile);

router.post('/update-profile-picture', 
  auth, 
  authorize(['member', 'superAdmin', 'clubAdmin', 'facultyCoordinator']), 
  handleProfilePictureUpload, 
  updateProfilePicture
);

router.get('/get-user-details', auth, getUserDetails);
router.get('/search', auth, authorize(['member', 'superAdmin', 'clubAdmin', 'facultyCoordinator']), searchUsers);
router.get('/all-users',auth,authorize(['superAdmin']),getAllUsers);
router.get('/eligible-users',auth,authorize(['superAdmin']),getEligibleUsers)

module.exports = router;