const express = require("express");
const router = express.Router();


const { 
    getAllClubs, 
    createClub, 
    addMemberToClub, 
    getClubDetails 
} = require("../Controller/clubController");

const {
    sendJoinRequest,
    getAllrequests,
    respondToJoinRequest,
    getUserJoinReq
} = require("../Controller/joinRequestController");


const { auth, authorize } = require('../middleware/authMiddleware');
const { uploadLogo } = require('../middleware/uploadMiddleware');


router.get('/', getAllClubs);
router.get('/:id', getClubDetails);
router.post(
    '/create',
    auth,
    authorize(['superAdmin']),
    uploadLogo,
    createClub
);
router.post(
    '/add-member', 
    auth, 
    authorize(['superAdmin', 'clubAdmin']), 
    addMemberToClub
);


router.post(
    '/:clubId/join-request',
    auth,
    authorize(['member']),
    sendJoinRequest
);

router.get(
    '/:clubId/join-request',
    auth,
    authorize(['clubAdmin']),
    getAllrequests
);

router.get(
    '/join-requests',  
    auth,
    authorize(['member']),
    getUserJoinReq    
);

router.post(
    '/:clubId/respond',
    auth,
    authorize(['clubAdmin']),
    respondToJoinRequest
);

module.exports = router;