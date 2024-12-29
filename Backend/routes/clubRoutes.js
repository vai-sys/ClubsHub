const express = require("express");
const router = express.Router();
const { getAllClubs, createClub, addMemberToClub,getClubDetails  } = require("../Controller/clubController");
const { auth, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllClubs);
router.get('/:id',getClubDetails )

router.post(
    '/create',
    auth,
    authorize(['superAdmin']),
    upload.single('clubLogo'),
    createClub
);

router.post('/add-member', auth, authorize(['superAdmin', 'clubAdmin']), addMemberToClub);


module.exports = router;
