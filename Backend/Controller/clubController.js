const { JWT_SECRET, JWT_EXPIRATION, UserRoles } = require('../config/constants');
const Club = require("../models/Club");
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
            .populate('clubLeadId', 'email name role')
            .populate('clubMembers.student', 'email name role');
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch clubs',
            error: error.message,
        });
    }
};

const getClubDetails= async (req, res) => {
    try {
        const clubs = await Club.find()
            .populate('clubLeadId', 'email name role')
            .populate({
                path: 'clubMembers.student',
                select: 'email name role',
            })
            .sort({ name: 1 }); 

        if (!clubs || clubs.length === 0) {
            return res.status(404).json({
                message: 'No clubs found',
            });
        }

        res.status(200).json({
            message: 'Clubs fetched and sorted successfully',
            clubs,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching clubs',
            error: error.message,
        });
    }
};







const createClub = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file); 
        
        const { name, description, clubLeadId } = req.body;
        const clubLogo = req.file ? req.file?.path : '/uploads/user.png';



        if (!name || !description || !clubLeadId || !clubLogo) {
            return res.status(400).json({
                message: 'Missing required fields: name, description, clubLeadId, and clubLogo are required'
            });
        }

        const existingClub = await Club.findOne({ name });
        if (existingClub) {
            return res.status(400).json({
                message: 'A club with this name already exists'
            });
        }

        const clubLead = await User.findById(clubLeadId);
        if (!clubLead) {
            return res.status(404).json({ message: 'Club lead not found' });
        }

        if (clubLead.role !== UserRoles.CLUB_ADMIN) {
            return res.status(403).json({ message: 'Club lead must have the CLUB_ADMIN role' });
        }

        const newClub = new Club({
            name,
            description,
            clubLeadId,
            clubLogo,
            clubMembers: [{
                student: clubLeadId,
                role: 'admin',
                joinedAt: new Date()
            }]
        });

        await newClub.save();

        clubLead.clubAffiliations.push({
            clubId: newClub._id,
            clubName: newClub.name,
            joinedAt: new Date(),
        });

        await clubLead.save();

        const populatedClub = await Club.findById(newClub._id)
            .populate('clubLeadId', 'email name role')
            .populate('clubMembers.student', 'email name role');

        res.status(201).json({
            message: 'Club created successfully',
            club: populatedClub,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating club',
            error: error.message,
        });
    }
};

const addMemberToClub = async (req, res) => {
    try {
        const { clubId, userId, role = 'member' } = req.body;

        if (!clubId || !userId) {
            return res.status(400).json({
                message: 'Club ID and user ID are required'
            });
        }

        if (!['clubAdmin', 'member', 'superAdmin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Allowed roles are admin and member.' });
        }

        const club = await Club.findOne({
            _id: clubId,
            isActive: true
        });

        if (!club) {
            return res.status(404).json({ message: 'Club not found or inactive' });
        }

        const user = await User.findOne({
            _id: userId,
            isActive: true
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found or inactive' });
        }

        const existingMember = club.clubMembers.find(
            member => member.student.toString() === userId
        );

        if (existingMember) {
            return res.status(400).json({ message: 'User is already a member of this club' });
        }

        club.clubMembers.push({
            student: userId,
            role: role,
            joinedAt: new Date()
        });

        await club.save();

        user.clubAffiliations.push({
            clubId: club._id,
            clubName: club.name,
            joinedAt: new Date(),
        });

        await user.save();

        const updatedClub = await Club.findById(club._id)
            .populate('clubLeadId', 'email name role')
            .populate('clubMembers.student', 'email role');

        res.status(200).json({
            message: 'Member added successfully',
            club: updatedClub
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error adding member to club',
            error: error.message
        });
    }
};

module.exports = {
    getAllClubs,
    createClub,
    addMemberToClub,
    getClubDetails 
};
