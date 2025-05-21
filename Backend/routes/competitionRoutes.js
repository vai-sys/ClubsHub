const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const { 
    createCompetition,
    registerForCompetition,
    getCompetitionById,
    updateCompetitionRounds,
    setRoundLiveStatus,
    getCompetitionParticipants,
    addJudgesToCompetition,
    cancelRegistration,
    getCompetitionByEventId,
} = require('../Controller/competitionController');



router.post('/', auth, authorize(['clubAdmin']),  createCompetition);


router.get('/:id', auth, authorize(['superAdmin', 'clubAdmin', 'facultyCoordinator', 'member']), getCompetitionById);


router.post('/:competitionId/register', auth, authorize(['member']), registerForCompetition);


router.put('/:competitionId/rounds', auth, authorize(['clubAdmin']), updateCompetitionRounds);


router.put('/:competitionId/rounds/:roundId/live', auth, authorize(['clubAdmin']), setRoundLiveStatus);


router.get('/:competitionId/participants', auth, authorize(['superAdmin', 'clubAdmin', 'facultyCoordinator']), getCompetitionParticipants);


router.put('/:competitionId/judges', auth, authorize(['clubAdmin']), addJudgesToCompetition);


router.delete('/:competitionId/registration', auth, authorize(['member', 'clubAdmin']), cancelRegistration);

router.get('/event/:eventId' ,auth,authorize(['member', 'superAdmin', 'clubAdmin', 'facultyCoordinator']), getCompetitionByEventId);




module.exports = router;