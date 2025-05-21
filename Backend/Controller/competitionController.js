const { Competition, Event } = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UserRoles } = require('../config/constants');
const Team = require('../models/Team');
const mongoose = require('mongoose');



const createCompetition = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or missing Authorization header' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Token missing' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("userId",decoded)
        
        const user = await User.findById(userId);
       
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        
        if (user.role !== UserRoles.CLUB_ADMIN) {
            return res.status(403).json({ 
                success: false,
                message: 'Only club admins can create competitions' 
            });
        }

        const { eventId, ...competitionDetails } = req.body;
        if (!eventId) {
            return res.status(400).json({ 
                success: false,
                message: 'Event ID is required to create a competition' 
            });
        }

        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false,
                message: 'Event not found' 
            });
        }

       
        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create competitions for this event'
            });
        }

       
        if (event.eventType !== 'COMPETITION') {
            return res.status(400).json({ 
                success: false,
                message: 'Competition can only be created for events with type COMPETITION' 
            });
        }

        
        const existingCompetition = await Competition.findOne({ event: eventId });
        if (existingCompetition) {
            return res.status(400).json({ 
                success: false,
                message: 'Competition already exists for this event' 
            });
        }

       
        const competitionData = {
            event: eventId,
            ...competitionDetails
        };

      
     

      
        const competition = await Competition.create(competitionData);

        return res.status(201).json({
            success: true,
            message: 'Competition created successfully',
            data: competition
        });

    } catch (error) {
        console.error('Competition creation error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error creating competition',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


const registerForCompetition = async (req, res) => {
    try {
        const { competitionId } = req.params;
        const { teamName, teamMembers } = req.body;

       
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or missing Authorization header' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
      
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        
        const competition = await Competition.findById(competitionId).populate('event');
        if (!competition) {
            return res.status(404).json({
                success: false,
                message: 'Competition not found'
            });
        }

        // Check if registration is still open
        if (new Date() > new Date(competition.registrationDeadline)) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline has passed'
            });
        }

        // Check if the event is approved
        const event = competition.event;
        if (event.approvalStatus !== 'SUPER_ADMIN_APPROVED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot register for a competition that is not fully approved'
            });
        }

        // Check if the event is canceled
        if (event.status === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot register for a canceled event'
            });
        }

        // Check if the max participants limit is reached
        if (event.maxParticipants && 
            event.registeredParticipants && 
            event.registeredParticipants.length >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Maximum participant limit reached'
            });
        }

        // Check if user already registered
        const isAlreadyRegistered = event.registeredParticipants.some(
            p => p.userId.toString() === userId
        );
        
        if (isAlreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this competition'
            });
        }

        // If it's a team competition, handle team registration
        if (competition.teamAllowed) {
            if (!teamName) {
                return res.status(400).json({
                    success: false,
                    message: 'Team name is required for team competitions'
                });
            }

            // Check team size limit
            if (competition.teamSizeLimit && 
                (!teamMembers || teamMembers.length > competition.teamSizeLimit - 1)) {
                return res.status(400).json({
                    success: false,
                    message: `Team size cannot exceed ${competition.teamSizeLimit} members (including you)`
                });
            }

            // Validate all team members exist
            if (teamMembers && teamMembers.length > 0) {
                const members = await User.find({ _id: { $in: teamMembers } });
                if (members.length !== teamMembers.length) {
                    return res.status(400).json({
                        success: false,
                        message: 'One or more team members do not exist'
                    });
                }

                // Check if any team member is already registered
                for (const memberId of teamMembers) {
                    const memberRegistered = event.registeredParticipants.some(
                        p => p.userId.toString() === memberId.toString()
                    );
                    
                    if (memberRegistered) {
                        const member = members.find(m => m._id.toString() === memberId.toString());
                        return res.status(400).json({
                            success: false,
                            message: `Team member ${member.name} is already registered for this competition`
                        });
                    }
                }
            }

            // Create a new team
            const team = await Team.create({
                name: teamName,
                leader: userId,
                members: teamMembers || [],
                competitionId: competitionId,
                eventId: event._id
            });

            // Register the team leader
            await Event.findByIdAndUpdate(
                event._id,
                {
                    $push: {
                        registeredParticipants: {
                            userId: userId,
                            registrationDate: new Date(),
                            status: 'CONFIRMED',
                            isTeamLeader: true,
                            teamId: team._id
                        }
                    }
                }
            );

            // Register team members
            if (teamMembers && teamMembers.length > 0) {
                for (const memberId of teamMembers) {
                    await Event.findByIdAndUpdate(
                        event._id,
                        {
                            $push: {
                                registeredParticipants: {
                                    userId: memberId,
                                    registrationDate: new Date(),
                                    status: 'CONFIRMED',
                                    isTeamLeader: false,
                                    teamId: team._id
                                }
                            }
                        }
                    );
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Team registered successfully for the competition',
                data: {
                    team,
                    eventName: event.name,
                    competitionName: competition.name || 'Competition'
                }
            });
        } else {
            // Handle individual registration
            if (teamMembers && teamMembers.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'This is an individual competition. Team registration is not allowed'
                });
            }

            // Register the individual
            await Event.findByIdAndUpdate(
                event._id,
                {
                    $push: {
                        registeredParticipants: {
                            userId: userId,
                            registrationDate: new Date(),
                            status: 'CONFIRMED'
                        }
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Successfully registered for the competition',
                data: {
                    participant: {
                        name: user.name,
                        email: user.email,
                        userId: user._id
                    },
                    eventName: event.name,
                    competitionName: competition.name || 'Competition'
                }
            });
        }

    } catch (error) {
        console.error('Competition registration error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error registering for competition',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


const getCompetitionById = async (req, res) => {
    try {
        const { id } = req.params;

        const competition = await Competition.findById(id)
            .populate({
                path: 'event',
                populate: [
                    { path: 'clubId', select: 'name clubLogo' },
                    { path: 'createdBy', select: 'name email' }
                ]
            });

        if (!competition) {
            return res.status(404).json({
                success: false,
                message: 'Competition not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: competition
        });

    } catch (error) {
        console.error('Error fetching competition:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching competition',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const updateCompetitionRounds = async (req, res) => {
    try {
        const { competitionId } = req.params;
        const { rounds } = req.body;

       
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or missing Authorization header' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
       
        const user = await User.findById(userId);
        if (!user || user.role !== UserRoles.CLUB_ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Only club admins can update competition rounds'
            });
        }

      
        const competition = await Competition.findById(competitionId).populate('event');
        if (!competition) {
            return res.status(404).json({
                success: false,
                message: 'Competition not found'
            });
        }

      
        if (competition.event.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this competition'
            });
        }

       
        competition.rounds = rounds;
        await competition.save();

        return res.status(200).json({
            success: true,
            message: 'Competition rounds updated successfully',
            data: competition
        });

    } catch (error) {
        console.error('Error updating competition rounds:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error updating competition rounds',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


const setRoundLiveStatus = async (req, res) => {
    try {
        const { competitionId, roundId } = req.params;
        const { isLive } = req.body;

        if (typeof isLive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isLive parameter must be a boolean'
            });
        }

      
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or missing Authorization header' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        // Find the user and check if they're a club admin
        const user = await User.findById(userId);
        if (!user || user.role !== UserRoles.CLUB_ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Only club admins can update round status'
            });
        }

        // Find the competition
        const competition = await Competition.findById(competitionId).populate('event');
        if (!competition) {
            return res.status(404).json({
                success: false,
                message: 'Competition not found'
            });
        }

        // Verify the event belongs to the admin's club
        if (competition.event.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this competition'
            });
        }

        // Find the round
        const roundIndex = competition.rounds.findIndex(round => round._id.toString() === roundId);
        if (roundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Round not found'
            });
        }

        // Set other rounds to not live if making this round live
        if (isLive) {
            competition.rounds.forEach((round, index) => {
                if (index !== roundIndex) {
                    round.isLive = false;
                }
            });
        }

       
        competition.rounds[roundIndex].isLive = isLive;
        await competition.save();

        return res.status(200).json({
            success: true,
            message: `Round ${isLive ? 'is now live' : 'is no longer live'}`,
            data: competition
        });

    } catch (error) {
        console.error('Error updating round status:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error updating round status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


const getCompetitionParticipants = async (req, res) => {
    try {
        const { competitionId } = req.params;

        // Find the competition
        const competition = await Competition.findById(competitionId);
        if (!competition) {
            return res.status(404).json({
                success: false,
                message: 'Competition not found'
            });
        }

        // Get the associated event
        const event = await Event.findById(competition.event)
            .populate('registeredParticipants.userId', 'name email department');
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found for this competition'
            });
        }

        // If team competition, organize by teams
        if (competition.teamAllowed) {
            // Get all teams for this competition
            const teams = await Team.find({ competitionId })
                .populate('leader', 'name email department')
                .populate('members', 'name email department');

            return res.status(200).json({
                success: true,
                count: teams.length,
                isTeamCompetition: true,
                data: teams
            });
        } else {
            // For individual competitions, return registered participants
            return res.status(200).json({
                success: true,
                count: event.registeredParticipants.length,
                isTeamCompetition: false,
                data: event.registeredParticipants
            });
        }

    } catch (error) {
        console.error('Error fetching competition participants:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching competition participants',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


const addJudgesToCompetition = async (req, res) => {
    try {
        const { competitionId } = req.params;
        const { judges } = req.body;

        if (!judges || !Array.isArray(judges)) {
            return res.status(400).json({
                success: false,
                message: 'Judges array is required'
            });
        }

       
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or missing Authorization header' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
      
        const user = await User.findById(userId);
        if (!user || user.role !== UserRoles.CLUB_ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Only club admins can add judges to a competition'
            });
        }

        
        const competition = await Competition.findById(competitionId).populate('event');
        if (!competition) {
            return res.status(404).json({
                success: false,
                message: 'Competition not found'
            });
        }

       
        if (competition.event.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this competition'
            });
        }

        
        competition.judges = judges;
        await competition.save();

        return res.status(200).json({
            success: true,
            message: 'Judges added to competition successfully',
            data: competition
        });

    } catch (error) {
        console.error('Error adding judges to competition:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error adding judges to competition',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


const cancelRegistration = async (req, res) => {
    try {
        const { competitionId } = req.params;

     
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or missing Authorization header' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

      
        const competition = await Competition.findById(competitionId);
        if (!competition) {
            return res.status(404).json({
                success: false,
                message: 'Competition not found'
            });
        }

       
        const event = await Event.findById(competition.event);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found for this competition'
            });
        }

     
        if (new Date() > new Date(event.date)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel registration after the event has started'
            });
        }

        // Find the participant entry
        const participantIndex = event.registeredParticipants.findIndex(
            p => p.userId.toString() === userId
        );

        if (participantIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'You are not registered for this competition'
            });
        }

        // If this is a team competition and the user is a team leader
        if (competition.teamAllowed && event.registeredParticipants[participantIndex].isTeamLeader) {
            const teamId = event.registeredParticipants[participantIndex].teamId;
            
            // Remove all team members from the event
            await Event.findByIdAndUpdate(
                event._id,
                {
                    $pull: {
                        registeredParticipants: {
                            teamId: teamId
                        }
                    }
                }
            );

           
            await Team.findByIdAndDelete(teamId);

            return res.status(200).json({
                success: true,
                message: 'Team registration cancelled successfully'
            });
        } 
       
        else if (competition.teamAllowed && !event.registeredParticipants[participantIndex].isTeamLeader) {
            const teamId = event.registeredParticipants[participantIndex].teamId;
            
          
            await Event.findByIdAndUpdate(
                event._id,
                {
                    $pull: {
                        registeredParticipants: {
                            userId: userId
                        }
                    }
                }
            );

           
            await Team.findByIdAndUpdate(
                teamId,
                {
                    $pull: {
                        members: userId
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: 'You have left the team for this competition'
            });
        }
       
        else {
         
            await Event.findByIdAndUpdate(
                event._id,
                {
                    $pull: {
                        registeredParticipants: {
                            userId: userId
                        }
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Registration cancelled successfully'
            });
        }

    } catch (error) {
        console.error('Error cancelling registration:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error cancelling registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const getCompetitionByEventId = async (req, res) => {
  try {
    let { eventId } = req.params;
    console.log("Raw eventId:", JSON.stringify(eventId));

    eventId = eventId.trim().replace(/[\s\r\n]+/g, '');
    console.log("Sanitized eventId:", JSON.stringify(eventId));

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log("Final eventId failed validation:", eventId, "Length:", eventId.length);
      return res.status(400).json({ success: false, message: 'Invalid event ID format' });
    }

    const objectIdEventId = new mongoose.Types.ObjectId(eventId);

    const competition = await Competition.findOne({ event: objectIdEventId }).lean();

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    return res.status(200).json({ success: true, data: competition });

  } catch (error) {
    console.error("Error in getCompetitionByEventId:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};



module.exports = {
    
    createCompetition,
    registerForCompetition,
    getCompetitionById,
    updateCompetitionRounds,
    setRoundLiveStatus,
    getCompetitionParticipants,
    addJudgesToCompetition,
    cancelRegistration,
   getCompetitionByEventId
};