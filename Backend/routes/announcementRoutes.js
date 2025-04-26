const express = require("express");
const { 
    createAnnouncement, 
    getAllAnnouncements, 
    getAnnouncementById, 
    updateAnnouncement, 
    deleteAnnouncement ,getAnnouncementsByClubId
} = require("../Controller/announcementController"); 
const {authorize,auth} =require("../middleware/authMiddleware")
const uploadAttachments = require("../middleware/uploadAttachments");

const router = express.Router();


router.post("/",auth,authorize(['superAdmin','clubAdmin']),uploadAttachments, createAnnouncement);
router.get("/",auth,  getAllAnnouncements);
router.get("/:id",auth, getAnnouncementById);
router.get("/club/:clubId", auth, getAnnouncementsByClubId);

router.put("/:id",auth ,authorize(['superAdmin','clubAdmin']), updateAnnouncement);
router.delete("/:id",auth,authorize(['superAdmin','clubAdmin']), deleteAnnouncement);

module.exports = router;  
