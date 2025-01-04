const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const { createEvent,getEvents,getEventById } = require('../Controller/eventController');
const { uploadEventFiles } = require('../middleware/uploadMiddleware');

router.post(
    '/create-event',
    auth,
    authorize(['clubAdmin']),
    uploadEventFiles,
    createEvent
);

router.get('/',auth,getEvents);

router.get('/:id',auth,getEventById);

module.exports = router;