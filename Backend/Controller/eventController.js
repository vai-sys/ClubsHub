const Event = require('../models/Event');
const User = require('../models/User');
const EventApproval = require('../models/EventApproval');
const jwt=require("jsonwebtoken")
const {JWT_SECRET} =require('../config/constants')
const Club =require('../models/Club')
const { UserRoles } = require('../config/constants');

const createEvent = async (req, res) => {
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
        const userId = decoded.userId;
        
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
                message: 'Only club admins can create events' 
            });
        }

       
        const { clubId, ...eventDetails } = req.body;
        if (!clubId) {
            return res.status(400).json({ 
                success: false,
                message: 'Club ID is required to create an event' 
            });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ 
                success: false,
                message: 'Club not found' 
            });
        }

   
        if (club.clubLeadId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create events for this club'
            });
        }

      
        const eventData = {
            ...eventDetails,
            clubId,
            createdBy: userId,
            approvalStatus: 'PENDING',
            facultyApproval: {
                approved: false,
                timestamp: null,
                comments: null
            },
            superAdminApproval: {
                approved: false,
                timestamp: null,
                comments: null
            }
        };

       
        if (req.files) {
            if (req.files.eventBanner?.[0]) {
                eventData.eventBanner = req.files.eventBanner[0].path;
            }
            console.log(eventData.eventBanner)
            
            if (req.files && req.files.attachments) {            
                 eventData.attachments = req.files.attachments.map(file => file.path);
         }          
        }

       
        const event = await Event.create(eventData);

        return res.status(201).json({
            success: true,
            message: 'Event created and pending faculty approval',
            data: event
        });

    } catch (error) {
        console.error('Event creation error:', error);
        
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
            message: 'Error creating event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};



const facultyApproval = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { approved, remark } = req.body;

     
        if (!eventId || typeof approved !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Event ID and approval status are required'
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
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

   
        const user = await User.findById(userId);
        if (!user || user.role !== UserRoles.FACULTY_COORDINATOR) {
            return res.status(403).json({
                success: false,
                message: 'Only faculty coordinators can approve events'
            });
        }

       
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.approvalStatus !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: `Event cannot be approved/rejected in ${event.approvalStatus} state`
            });
        }

  
        const club = await Club.findById(event.clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        if (club.facultyCoordinater.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to approve events for this club'
            });
        }

     
        const updateData = {
            'facultyApproval.approved': approved,
            'facultyApproval.remark': remark || '',
            'facultyApproval.approvedBy': userId,
            'facultyApproval.approvedAt': new Date(),
            approvalStatus: approved ? 'FACULTY_APPROVED' : 'REJECTED'
        };

   
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        ).populate([
            { path: 'createdBy', select: 'name email' },
            { path: 'clubId', select: 'name' },
            { path: 'facultyApproval.approvedBy', select: 'name email' }
        ]);

      
        await EventApproval.create({
            eventId,
            approvedBy: userId,
            approvalStatusRole: approved ? 'approved' : 'rejected',
            role: 'facultyCoordinator'
        });

        return res.status(200).json({
            success: true,
            message: approved
                ? 'Event approved and pending super admin approval'
                : 'Event rejected by faculty coordinator',
            data: updatedEvent
        });

    } catch (error) {
        console.error('Faculty approval error:', error);

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
            message: 'Error processing faculty approval',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


const superAdminApproval = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { approved, remark } = req.body;

       
        if (!eventId || typeof approved !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Event ID and approval status are required'
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
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing'
            });
        }

       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

       
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== UserRoles.SUPER_ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Only super admins can perform final approval'
            });
        }

        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

     
        const validTransitions = {
            'FACULTY_APPROVED': true,
            'PENDING': false,
            'SUPER_ADMIN_APPROVED': false,
            'REJECTED': false
        };

        if (!validTransitions[event.approvalStatus]) {
            let message = 'Event cannot be processed - ';
            switch (event.approvalStatus) {
                case 'PENDING':
                    message += 'it needs faculty approval first';
                    break;
                case 'SUPER_ADMIN_APPROVED':
                    message += 'it has already been approved by super admin';
                    break;
                case 'REJECTED':
                    message += 'it has already been rejected';
                    break;
                default:
                    message += `invalid status: ${event.approvalStatus}`;
            }
            
            return res.status(400).json({
                success: false,
                message
            });
        }

       
        const updateData = {
            'superAdminApproval.approved': approved,
            'superAdminApproval.remark': remark || '',
            'superAdminApproval.approvedBy': userId,
            'superAdminApproval.approvedAt': new Date(),
            approvalStatus: approved ? 'SUPER_ADMIN_APPROVED' : 'REJECTED'
        };

      
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        ).populate([
            { path: 'createdBy', select: 'name email' },
            { path: 'clubId', select: 'name' },
            { path: 'facultyApproval.approvedBy', select: 'name email' },
            { path: 'superAdminApproval.approvedBy', select: 'name email' }
        ]);

        
        await EventApproval.create({
            eventId,
            approvedBy: userId,
            approvalStatusRole: approved ? 'approved' : 'rejected',
            role: 'superAdmin'
        });

        return res.status(200).json({
            success: true,
            message: approved 
                ? 'Event has been fully approved' 
                : 'Event rejected by super admin',
            data: updatedEvent
        });

    } catch (error) {
        console.error('Super admin approval error:', error);

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
            message: 'Error processing super admin approval',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};



const getFacultyApprovedEvents = async (req, res) => {
    try {
      // Authorization is already handled by middleware, so we can focus on business logic
      const events = await Event.find({
        approvalStatus: 'FACULTY_APPROVED',
        'facultyApproval.approved': true
      }).populate([
        { path: 'clubId', select: 'name' },
        { path: 'createdBy', select: 'name email' },
        { path: 'facultyApproval.approvedBy', select: 'name email' },
        { path: 'registeredParticipants.userId', select: 'name email' }
      ]);
      
      return res.status(200).json({
        success: true,
        count: events.length,
        data: events
      });
    } catch (error) {
      console.error('Error fetching faculty approved events:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching faculty approved events',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
  const getPendingEventsForFaculty = async (req, res) => {
    try {
    

      
    
      const userId = req.userId;
      
      
      const clubs = await Club.find({ facultyCoordinater: userId });
      const clubIds = clubs.map(club => club._id);
      
     
      const events = await Event.find({
        clubId: { $in: clubIds },
        approvalStatus: 'PENDING',
        'facultyApproval.approved': false
      }).populate([
        { path: 'clubId', select: 'name' },
        { path: 'createdBy', select: 'name email' },
        { path: 'registeredParticipants.userId', select: 'name email' }
      ]).sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: events.length,
        data: events
      });
    } catch (error) {
      console.error('Error fetching pending events for faculty:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching pending events',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };


const getApprovedEvents = async (req, res) => {
    try {
      
        const { 
            eventType, 
            mode, 
            status, 
            department, 
            clubId,
            startDate,
            endDate 
        } = req.query;

        const filter = {
            approvalStatus: 'SUPER_ADMIN_APPROVED',
            'superAdminApproval.approved': true
        };

        if (eventType) filter.eventType = eventType;
        if (mode) filter.mode = mode;
        if (status) filter.status = status;
        if (department) filter.departmentsAllowed = department;
        if (clubId) filter.clubId = clubId;
        
      
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const events = await Event.find(filter)
            .populate([
                { path: 'clubId', select: 'name clubLogo' },
                { path: 'createdBy', select: 'name email' },
                { path: 'registeredParticipants.userId', select: 'name email' }
            ])
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Error fetching approved events:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching approved events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const trackEventProgress = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or missing Authorization header' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        console.log("token",token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("decoded",decoded);

        const user = await User.findById(userId);
        if (!user || user.role !== UserRoles.CLUB_ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only club admins can track their events'
            });
        }

        const events = await Event.find({
            createdBy: userId
        }).populate([
            { path: 'clubId', select: 'name' },
            { path: 'facultyApproval.approvedBy', select: 'name email' },
            { path: 'superAdminApproval.approvedBy', select: 'name email' },
            { path: 'createdBy', select: 'name email' }
        ]);

        const approvalHistory = await EventApproval.find({
            eventId: { $in: events.map(event => event._id) }
        }).populate('approvedBy', 'name email role remark');
        console.log(approvalHistory)

        const eventsWithProgress = events.map(event => {
            const eventApprovals = approvalHistory.filter(
                approval => approval.eventId.toString() === event._id.toString()
            );

            const rejectedByFaculty = event.approvalStatus === 'REJECTED' && !event.facultyApproval.approved;
            const rejectedBySuperAdmin = event.approvalStatus === 'REJECTED' && event.facultyApproval.approved;

            return {
                _id: event._id,
                name: event.name,
                description: event.description,
                clubId: event.clubId,
                date: event.date,
                venue: event.venue,
                duration: event.duration,
                tags: event.tags,
                fees: event.fees,
                maxParticipants: event.maxParticipants,
                registrationDeadline: event.registrationDeadline,
                platformLink: event.platformLink,
                eventBanner: event.eventBanner,
                eventType: event.eventType,
                mode: event.mode,
                status: event.status,
                createdBy: event.createdBy,
                attachments: event.attachments,
                departmentsAllowed: event.departmentsAllowed,
                approvalStatus: event.approvalStatus,
                registeredParticipants: event.registeredParticipants?.length || 0,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                currentStatus: {
                    isRejected: event.approvalStatus === 'REJECTED',
                    rejectedBy: rejectedByFaculty ? 'Faculty Coordinator' : 
                               rejectedBySuperAdmin ? 'Super Admin' : null,
                    rejectionRemark: rejectedByFaculty ? event.facultyApproval.remark :
                                    rejectedBySuperAdmin ? event.superAdminApproval.remark : null,
                    rejectionDate: rejectedByFaculty ? event.facultyApproval.approvedAt :
                                 rejectedBySuperAdmin ? event.superAdminApproval.approvedAt : null
                },
                progress: {
                    created: {
                        completed: true,
                        date: event.createdAt,
                        by: event.createdBy
                    },
                    facultyApproval: {
                        status: rejectedByFaculty ? 'REJECTED' : 
                                event.approvalStatus === 'PENDING' ? 'PENDING' :
                                'APPROVED',
                        completed: event.approvalStatus !== 'PENDING',
                        date: event.facultyApproval.approvedAt,
                        remark: event.facultyApproval.remark,
                        approved: event.facultyApproval.approved,
                        approver: event.facultyApproval.approvedBy
                    },
                    superAdminApproval: {
                        status: rejectedBySuperAdmin ? 'REJECTED' :
                                event.approvalStatus === 'SUPER_ADMIN_APPROVED' ? 'APPROVED' :
                                event.approvalStatus === 'FACULTY_APPROVED' ? 'PENDING' :
                                'NOT_APPLICABLE',
                        completed: ['SUPER_ADMIN_APPROVED', 'REJECTED'].includes(event.approvalStatus) && event.facultyApproval.approved,
                        date: event.superAdminApproval.approvedAt,
                        remark: event.superAdminApproval.remark,
                        approved: event.superAdminApproval.approved,
                        approver: event.superAdminApproval.approvedBy
                    }
                },
                approvalHistory: eventApprovals.map(approval => ({
                    role: approval.role,
                    status: approval.approvalStatusRole,
                    approver: approval.approvedBy,
                    remark: approval.remark,
                    date: approval.approvedAt
                }))
            };
        });

        const categorizedEvents = {
            pending: eventsWithProgress.filter(event => event.approvalStatus === 'PENDING'),
            facultyApproved: eventsWithProgress.filter(event => event.approvalStatus === 'FACULTY_APPROVED'),
            superAdminApproved: eventsWithProgress.filter(event => event.approvalStatus === 'SUPER_ADMIN_APPROVED'),
            rejected: eventsWithProgress.filter(event => event.approvalStatus === 'REJECTED'),
        };

        return res.status(200).json({
            success: true,
            count: {
                total: eventsWithProgress.length,
                pending: categorizedEvents.pending.length,
                facultyApproved: categorizedEvents.facultyApproved.length,
                superAdminApproved: categorizedEvents.superAdminApproved.length,
                rejected: categorizedEvents.rejected.length
            },
            data: {
                all: eventsWithProgress,
                categorized: categorizedEvents
            }
        });
    } catch (error) {
        console.error('Error tracking event progress:', error);
        return res.status(500).json({
            success: false,
            message: 'Error tracking event progress',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate([
                { path: 'clubId', select: 'name clubLogo' },
                { path: 'createdBy', select: 'name email' },
                { path: 'registeredParticipants.userId', select: 'name email' }
            ]);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: event
        });

    } catch (error) {
        console.error('Error fetching event by id:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


module.exports = {
    createEvent,
    facultyApproval,
    superAdminApproval,
    getFacultyApprovedEvents,
    getPendingEventsForFaculty,
    getApprovedEvents,
    trackEventProgress,
    getEventById
    
};























