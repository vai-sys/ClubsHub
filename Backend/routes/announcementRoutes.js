const express = require("express");
const { 
    createAnnouncement, 
    GetAllAnnouncements, 
    getAnnouncementById, 
    updateAnnouncement, 
    deleteAnnouncement 
} = require("../Controller/announcementController"); 

const router = express.Router();


router.post("/", createAnnouncement);
router.get("/", GetAllAnnouncements);
router.get("/:id", getAnnouncementById);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;  
