const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const { createEvent,
    facultyApproval,
    superAdminApproval,
    getFacultyApprovedEvents,
    getPendingEventsForFaculty,
    getApprovedEvents,
    getEventById,
    trackEventProgress } = require('../Controller/eventController');
const { uploadEventFiles } = require('../middleware/uploadMiddleware');


router.post('/', auth,authorize(['clubAdmin']),uploadEventFiles, createEvent);
router.put('/:eventId/faculty-approval',auth,authorize(['facultyCoordinator']),  facultyApproval);
router.put('/:eventId/super-admin-approval', auth,authorize(['superAdmin']), superAdminApproval);

router.get('/faculty-approved',auth,authorize(['superAdmin','clubAdmin']), getFacultyApprovedEvents);
router.get('/pending-faculty',auth,authorize(['facultyCoordinator']), getPendingEventsForFaculty);
router.get('/approved', auth,authorize(['superAdmin','clubAdmin','facultyCoordinator','member']),getApprovedEvents);
router.get('/track-progress',auth,authorize(['clubAdmin']), trackEventProgress);
router.get('/:id',auth,authorize(['superAdmin','clubAdmin','facultyCoordinator','member']),getEventById)


module.exports = router;