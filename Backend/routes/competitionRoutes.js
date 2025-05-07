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
    cancelRegistration
} = require('../Controller/competitionController');


// Create a competition
router.post('/', auth, authorize(['clubAdmin']),  createCompetition);


router.get('/:id', auth, authorize(['superAdmin', 'clubAdmin', 'facultyCoordinator', 'member']), getCompetitionById);

// Register for competition
router.post('/:competitionId/register', auth, authorize(['member']), registerForCompetition);

// Update competition rounds
router.put('/:competitionId/rounds', auth, authorize(['clubAdmin']), updateCompetitionRounds);

// Set round live status
router.put('/:competitionId/rounds/:roundId/live', auth, authorize(['clubAdmin']), setRoundLiveStatus);

// Get competition participants/teams
router.get('/:competitionId/participants', auth, authorize(['superAdmin', 'clubAdmin', 'facultyCoordinator']), getCompetitionParticipants);

// Add judges to competition
router.put('/:competitionId/judges', auth, authorize(['clubAdmin']), addJudgesToCompetition);

// Cancel registration for competition
router.delete('/:competitionId/registration', auth, authorize(['member', 'clubAdmin']), cancelRegistration);

module.exports = router;