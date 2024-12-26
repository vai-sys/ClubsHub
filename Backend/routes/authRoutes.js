const express = require('express');
const router = express.Router();
const {
  login,
  register,
  logout,
 UpdateProfile,
  getUserProfile,
  
} = require('../Controller/authController');
const { auth, authorize } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);


router.post('/logout', auth, logout);
router.get('/profile',auth, authorize(['student', 'superAdmin','clubAdmin']), getUserProfile);
router.put('/update-profile',auth,authorize(['student','superAdmin','clubAdmin']),UpdateProfile);



router.get(
  '/admin-dashboard',
  auth,
  authorize(['superAdmin']),
  (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard!' });
  }
);

module.exports = router;