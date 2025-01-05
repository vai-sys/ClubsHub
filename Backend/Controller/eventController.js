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

const PARTICIPANT_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    ATTENDED: 'ATTENDED'
};

const validateEventData = (body, files) => {
   
    if (body.maxParticipants) {
        body.maxParticipants = parseInt(body.maxParticipants, 10);
    }
    
    if (body.duration) {
        body.duration = parseInt(body.duration, 10);
    }

    if(body.fees) {
        body.fees = parseInt(body.fees, 10);
    }

   
    const requiredFields = [
        'name', 
        'description', 
        'ClubId', 
        'date', 
        'venue', 
        'duration', 
        'eventType', 
        'mode'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    
    if (!files?.eventBanner?.[0]?.path) {
        throw new Error("Event banner image is required");
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

  
    if (body.maxParticipants !== undefined) {
        if (isNaN(body.maxParticipants) || !Number.isInteger(body.maxParticipants) || body.maxParticipants <= 0) {
            throw new Error("Maximum participants must be a positive integer");
        }
    }

  
    if (['ONLINE', 'HYBRID'].includes(body.mode) && !body.platformLink) {
        throw new Error("Platform link is required for online/hybrid events");
    }

   
    let validatedTags = [];
    if (body.tags) {
        if (typeof body.tags === 'string') {
            try {
                validatedTags = JSON.parse(body.tags);
            } catch (e) {
                throw new Error("Invalid tags format");
            }
        } else if (Array.isArray(body.tags)) {
            validatedTags = body.tags;
        } else {
            throw new Error("Tags must be an array or a JSON string");
        }

        if (!Array.isArray(validatedTags)) {
            throw new Error("Tags must be an array");
        }

        
        validatedTags.forEach(tag => {
            if (typeof tag !== 'string' || tag.trim().length === 0) {
                throw new Error("Each tag must be a non-empty string");
            }
        });
    }

    return {
        eventDate,
        tags: validatedTags,
        eventBanner: files.eventBanner[0].path,
        attachments: files?.attachments?.map(file => file.path) || [],
        parsedBody: body
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

        const { eventDate, eventBanner, attachments, parsedBody, tags } = validateEventData(req.body, req.files);

        const [user, club] = await Promise.all([
            User.findById(decoded.userId),
            Club.findById(parsedBody.ClubId)
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

        const eventData = {
            ...parsedBody,
            date: eventDate,
            eventBanner,
            createdBy: user._id,
            status: "upcoming",
            attachments,
            registeredParticipants: [],
            tags,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const event = new Event(eventData);
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



const getEventById = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(' ')[1];
        await jwt.verify(token, JWT_SECRET);

        const { id } = req.params;
        const currentTime = new Date();

        const event = await Event.findById(id)
            .populate('ClubId', 'name clubLogo description')
            .populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const calculateEventStatus = (event, currentTime) => {
            const eventStart = new Date(event.date);
            const eventEnd = new Date(event.date.getTime() + event.duration * 60 * 60 * 1000); 
        
            let status;
            if (currentTime < eventStart) {
                status = "upcoming";
            } else if (currentTime >= eventStart && currentTime <= eventEnd) {
                status = "ongoing";
            } else if (currentTime > eventEnd) {
                status = "completed";
            }
            return status;
        };
        

        const updatedEvent = {
            ...event.toObject(),
            status: calculateEventStatus(event, currentTime)
        };

        return res.status(200).json({
            success: true,
            data: updatedEvent
        });
    } catch (error) {
        console.error("Error in getEventById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getEvents = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(' ')[1];
        await jwt.verify(token, JWT_SECRET);

        const currentTime = new Date();

        const events = await Event.find()
            .populate('ClubId', 'name clubLogo description')
            .populate('createdBy', 'name email')
            .sort({ date: 1 });

    
        const updatedEvents = events.map(event => {
            const eventStart = new Date(event.date);
            const eventEnd = new Date(event.date.getTime() + event.duration * 60 * 60 * 1000); // duration in hours

            let status;
            if (currentTime < eventStart) {
                status = "upcoming";
            } else if (currentTime >= eventStart && currentTime <= eventEnd) {
                status = "ongoing";
            } else if (currentTime > eventEnd) {
                status = "completed";
            }

           
            return { ...event.toObject(), status };
        });

        return res.status(200).json({
            success: true,
            data: updatedEvents
        });
    } catch (error) {
        console.error("Error in getEvents:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = { 
    createEvent,
    EVENT_TYPES,
    EVENT_MODES,
    PARTICIPANT_STATUS,
    getEvents,
    getEventById
};