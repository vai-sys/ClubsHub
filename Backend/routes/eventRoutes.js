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
    registerForEvent,
    getParticipatedEvents,
    getAllRegisteredTeamsForClub,
    getClubEventParticipants,
    trackEventProgress } = require('../Controller/eventController');
const { uploadEventFiles } = require('../middleware/uploadMiddleware');





router.post('/', auth,authorize(['clubAdmin']),uploadEventFiles, createEvent);
router.put('/:eventId/faculty-approval',auth,authorize(['facultyCoordinator']),  facultyApproval);
router.put('/:eventId/super-admin-approval', auth,authorize(['superAdmin']), superAdminApproval);

router.get('/faculty-approved',auth,authorize(['superAdmin','clubAdmin']), getFacultyApprovedEvents);
router.get('/pending-faculty',auth,authorize(['facultyCoordinator']), getPendingEventsForFaculty);
router.get('/approved', auth,authorize(['superAdmin','clubAdmin','facultyCoordinator','member']),getApprovedEvents);
router.get('/track-progress',auth,authorize(['clubAdmin']), trackEventProgress);
// router.get('/:id',auth,authorize(['superAdmin','clubAdmin','facultyCoordinator','member']),getEventById)
router.post('/:id/register',auth,authorize(['member','clubAdmin']),registerForEvent);
router.get('/user-events/:userId',auth,authorize(['member','clubAdmin','superAdmin','facultyCoordinator']),
getParticipatedEvents)
router.get('/teams/:clubId',auth,authorize(['clubAdmin']),getAllRegisteredTeamsForClub);

router.get('/participants', auth, authorize(['clubAdmin']), getClubEventParticipants);


router.get('/:id', auth, authorize(['superAdmin','clubAdmin','facultyCoordinator','member']), getEventById);



module.exports = router;