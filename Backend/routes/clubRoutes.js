const express = require("express");
const router = express.Router();
const { getAllClubs, createClub, addMemberToClub,getClubDetails  } = require("../Controller/clubController");
const {sendJoinRequest,getAllrequests,respondToJoinRequest}=require("../Controller/joinRequestController")
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

router.post('/:clubId/request',auth,authorize(['member']),sendJoinRequest);
router.get('/:clubId/request',auth,authorize(['clubAdmin']),getAllrequests);
router.post('/:clubId/respond',auth,authorize(['clubAdmin']),respondToJoinRequest);


module.exports = router;
