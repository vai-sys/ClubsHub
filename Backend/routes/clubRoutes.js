const express = require("express");
const router = express.Router();
const JoinRequest=require("../models/JoinRequest")


const { 
    getAllClubs, 
    createClub, 
    assignRoleToClubMember, 
    getClubDetails ,
    clubAdminUsingID,
     getClubDetailsById,
     getUserClubAffiliationsWithDetails
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
router.get('/', getClubDetails);
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
    authorize([ 'superAdmin']), 
   assignRoleToClubMember
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

router.get('/:userId/clubs-with-admin-status',auth,clubAdminUsingID)

router.post(
    '/:clubId/respond',
    auth,
    authorize(['clubAdmin']),
    respondToJoinRequest
);

router.get('/:clubId', auth, authorize(['member', 'clubAdmin', 'superAdmin']), getClubDetailsById);
router.get('/user-club/:userId',auth,authorize(['member', 'clubAdmin', 'superAdmin','facultyCoordinater']),getUserClubAffiliationsWithDetails)

module.exports = router;