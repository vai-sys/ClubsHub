const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const { createEvent } = require('../Controller/eventController');
const { uploadEventFiles } = require('../middleware/uploadMiddleware');

router.post(
    '/create-event',
    auth,
    authorize(['clubAdmin']),
    uploadEventFiles,
    createEvent
);

module.exports = router;