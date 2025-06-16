const { JWT_SECRET, JWT_EXPIRATION, UserRoles } = require('../config/constants');
const Club = require("../models/Club");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose=require("mongoose")

const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return req.cookies?.token || null;
};

const getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find({})
        .populate({ path: 'clubLeadId', select: 'email name role department' })
        .populate({ path: 'facultyCoordinater', select: 'name email department' })
        .populate({ path: 'clubMembers.student', select: 'email name role department' })
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch clubs',
            error: error.message,
        });
    }
};



const getClubDetails = async (req, res) => {
    try {
        const clubs = await Club.find()
            .populate({ path: 'clubLeadId', select: 'email name role department' })
            .populate({ path: 'facultyCoordinater', select: 'name email department' })
            .populate({ path: 'clubMembers.student', select: 'email name role department' })
            .sort({ name: 1 });

        if (!clubs || clubs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No clubs found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Clubs fetched successfully',
            data: clubs,
        });
    } catch (error) {
        console.error('Error in getClubDetails:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching clubs',
            error: error.message,
        });
    }
};




const createClub = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            clubLeadId, 
            facultyCoordinater,
            clubCategory 
        } = req.body;
        
        const clubLogo = req.file?.path || '/uploads/user.png';

        if (!name || !description || !clubLeadId || !facultyCoordinater || !clubCategory) {
            return res.status(400).json({
                message: 'Missing required fields: name, description, clubLeadId, facultyCoordinater, and clubCategory are required'
            });
        }

        const [existingClub, clubLead, facultyMember] = await Promise.all([
            Club.findOne({ name }),
            User.findById(clubLeadId),
            User.findById(facultyCoordinater)
        ]);

        if (existingClub) {
            return res.status(400).json({
                message: 'A club with this name already exists'
            });
        }

        if (!clubLead || !facultyMember) {
            return res.status(404).json({
                message: !clubLead ? 'Club lead not found' : 'Faculty coordinator not found'
            });
        }

        if (clubLead.role !== UserRoles.CLUB_ADMIN) {
            return res.status(403).json({
                message: 'Club lead must have the CLUB_ADMIN role'
            });
        }

        if (facultyMember.role !== UserRoles.FACULTY_COORDINATOR) {
            return res.status(403).json({
                message: 'Faculty coordinator must have FACULTY role'
            });
        }

      
        if (clubLead.clubAffiliations.some(affiliation => affiliation.clubName === name) ||
            facultyMember.clubAffiliations.some(affiliation => affiliation.clubName === name)) {
            return res.status(400).json({
                message: 'User already affiliated with a club of this name'
            });
        }

        const newClub = new Club({
            name,
            description,
            clubLeadId,
            clubLogo,
            facultyCoordinater,
            clubCategory,
            clubMembers: [{
                student: clubLeadId,
                role: 'admin',
                joinedAt: new Date()
            }],
            isActive: true,
            createdAt: new Date()
        });

        await newClub.save();
        
        const newAffiliation = {
            clubId: newClub._id,
            clubName: newClub.name,
            joinedAt: new Date()
        };

        clubLead.clubAffiliations.push(newAffiliation);
        facultyMember.clubAffiliations.push(newAffiliation);

        await Promise.all([
            clubLead.save(),
            facultyMember.save()
        ]);

        const populatedClub = await Club.findById(newClub._id)
            .populate('clubLeadId', 'email name role')
            .populate('facultyCoordinater', 'email name role')
            .populate('clubMembers.student', 'email name role');

        res.status(201).json({
            message: 'Club created successfully',
            club: populatedClub
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error creating club',
            error: error.message
        });
    }
};

const assignRoleToClubMember = async (req, res) => {
    try {
        const { clubId, userId, role } = req.body;
        const requestingUser = req.user;

       
        if (requestingUser.role !== 'superAdmin') {
            return res.status(403).json({
                message: 'Only super admins can assign roles'
            });
        }

        
        if (!clubId || !userId || !role) {
            return res.status(400).json({
                message: 'Club ID, User ID, and Role are required'
            });
        }

        const validRoles = ['clubAdmin', 'facultyCoordinator', 'member', 'superAdmin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: `Invalid role. Allowed roles are: ${validRoles.join(', ')}`
            });
        }

      
        const [club, user] = await Promise.all([
            Club.findOne({ _id: clubId, isActive: true }),
            User.findOne({ _id: userId, isActive: true })
        ]);

        if (!club) {
            return res.status(404).json({ message: 'Club not found or inactive' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found or inactive' });
        }

       
        const alreadyMember = club.clubMembers.some(
            member => member.student.toString() === userId
        );

        if (alreadyMember) {
            return res.status(400).json({ 
                message: 'User is already a member of this club'
            });
        }

        const joinedAt = new Date();

      
        club.clubMembers.push({
            student: userId,
            role: role,
            joinedAt,
            addedBy: requestingUser._id
        });

       
        user.clubAffiliations.push({
            clubId: club._id,
            clubName: club.name,
            role: role,
            joinedAt
        });

        
        await Promise.all([club.save(), user.save()]);

        res.status(200).json({
            message: `User successfully assigned role: ${role}`,
            newMember: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role,
                joinedAt
            }
        });

    } catch (error) {
        console.error('Error assigning role:', error);
        res.status(500).json({
            message: 'Error assigning role to club member',
            error: error.message
        });
    }
};




const clubAdminUsingID= async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).select('clubAffiliations');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
  
      const clubIds = user.clubAffiliations.map(c => c.clubId);
  
     
      const clubs = await Club.find({ _id: { $in: clubIds } });
  
      
      const result = clubs.map(club => {
        const isLead = club.clubLeadId.toString() === userId;
        const isAdminMember = club.clubMembers.some(
          member =>
            member.student.toString() === userId && member.role.toLowerCase() === 'clubAdmin'
        );
  
        return {
          clubId: club._id,
          clubName: club.name,
          isClubAdmin: isLead || isAdminMember,
        };
      });
  
      res.json({ userId, clubs: result });
    } catch (error) {
      console.error('Error fetching club admin status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
const getClubDetailsById = async (req, res) => {
  try {
    const clubId = req.params.clubId; 
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ error: 'Invalid club ID' });
    }

   
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

   
    return res.status(200).json({ club });
  } catch (error) {
    console.error('Error getting club by ID:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const getUserClubAffiliationsWithDetails = async (req, res) => {
  const { userId } = req.params;
  console.log('User ID:', userId);
  
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'clubAffiliations.clubId',
        select: 'name description clubLogo clubCategory isActive facultyCoordinater',
      })
      .select('clubAffiliations');
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User Club Affiliations with Club Details:', user.clubAffiliations);
    
    return res.status(200).json({
      success: true,
      data: user.clubAffiliations,
      message: 'Club affiliations retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching club affiliations:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
module.exports = {
    getAllClubs,
    createClub,
   assignRoleToClubMember,
    getClubDetails,
    clubAdminUsingID ,
    getClubDetailsById,
    getUserClubAffiliationsWithDetails
};
