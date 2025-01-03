const User = require("../models/User");
const Club = require("../models/Club");
const Event = require("../models/Event");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

const EVENT_TYPES = {
    WORKSHOP: 'WORKSHOP',
    SEMINAR: 'SEMINAR',
    COMPETITION: 'COMPETITION',
    MEETUP: 'MEETUP',
    CULTURAL: 'CULTURAL',
    TECHNICAL: 'TECHNICAL',
    OTHER: 'OTHER'
};

const EVENT_MODES = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    HYBRID: 'HYBRID'
};

const validateEventData = (body, files) => {
    const requiredFields = ['name', 'description', 'ClubId', 'date', 'venue', 'duration', 'eventType', 'mode'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (!Object.values(EVENT_TYPES).includes(body.eventType)) {
        throw new Error("Invalid event type");
    }

    if (!Object.values(EVENT_MODES).includes(body.mode)) {
        throw new Error("Invalid event mode");
    }

    const eventDate = new Date(body.date);
    if (isNaN(eventDate.getTime())) {
        throw new Error("Invalid date format");
    }

    if (body.registrationDeadline) {
        const deadlineDate = new Date(body.registrationDeadline);
        if (isNaN(deadlineDate.getTime()) || deadlineDate >= eventDate) {
            throw new Error("Invalid registration deadline; it must be before the event date");
        }
    }

    return {
        eventDate,
        eventBanner: files?.eventBanner?.[0]?.path,
        attachments: files?.attachments?.map(file => file.path) || []
    };
};

const createEvent = async (req, res) => {
    try {
       

        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: "Authorization header missing or invalid format"
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const { eventDate, eventBanner, attachments } = validateEventData(req.body, req.files);

        const [user, club] = await Promise.all([
            User.findById(decoded.userId),
            Club.findById(req.body.ClubId)
        ]);

        if (!user || !club) {
            return res.status(404).json({
                success: false,
                message: !user ? "User not found" : "Club not found"
            });
        }

        const clubMember = club.clubMembers.find(member => 
            member.student.toString() === user._id.toString() && 
            member.role === 'admin' 
        );
        

        if (!clubMember) {
            return res.status(403).json({
                success: false,
                message: "Only club admins can create events"
            });
        }

        const event = new Event({
            ...req.body,
            date: eventDate,
            eventBanner,
            createdBy: user._id,
            status: "upcoming",
            attachments,
            registeredParticipants: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await event.save();

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event
        });

    } catch (error) {
        console.error("Error in createEvent:", error);

        const statusCode = error.name === 'ValidationError' ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: statusCode === 400 ? error.message : "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports={createEvent}