const express=require("express");
const router=express.Router();
const { getAllclubs,createClub,addMemberToClub} =require("../Controller/clubController");
const { auth, authorize } = require('../middleware/authMiddleware');


router.get('/',getAllclubs);

router.post('/create',auth,authorize(['superAdmin']),createClub)
router.post('/add-member', auth, authorize(['superAdmin', 'clubAdmin']), addMemberToClub);

module.exports=router;