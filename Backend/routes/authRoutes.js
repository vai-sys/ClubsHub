const express = require('express');
const router = express.Router();
const {
  login,
  register,
  logout,
  updateProfile, 
  getUserProfile,
  getUserDetails,getFacultyDetails
} = require('../Controller/authController'); 
const { auth, authorize } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);


router.post('/logout', auth, logout);
router.get('/profile', auth, authorize(['member', 'superAdmin', 'clubAdmin','facultyCoordinator']), getUserProfile);
router.put('/update-profile', auth, authorize(['member', 'superAdmin', 'clubAdmin','facultyCoordinator']), updateProfile); 
router.get('/get-user-details',auth,getUserDetails)

module.exports = router;