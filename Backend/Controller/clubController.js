const { JWT_SECRET, JWT_EXPIRATION, UserRoles } = require('../config/constants');
const Club=require("../models/Club");
const jwt = require('jsonwebtoken');
const User=require('../models/User')


const getTokenFromRequest = (req) => {
 
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); 
    }
  
    return req.cookies.token;
  };
const getAllclubs = async (req, res) => {
    try {

      const token = getTokenFromRequest(req);
      if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user || (user.role !== UserRoles.STUDENT && user.role !== UserRoles.SUPER_ADMIN)) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
     
      const clubs = await Club.find({});
  
      res.status(200).json({
        message: 'Clubs fetched successfully',
        clubs: clubs,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch clubs',
        error: error.message,
      });
    }
  };


  const createClub = async (req, res) => {
    try {
        const { name, description, clubLeadId, clubLogo } = req.body;

     
        if (!name || !description || !clubLeadId) {
            return res.status(400).json({
                message: 'Missing required fields: name, description, and clubLeadId are required'
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
        });

        await newClub.save();

        res.status(201).json({
            message: 'Club created successfully',
            club: newClub,
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
      const { clubName, userId } = req.body;

      if (!clubName || !userId) {
          return res.status(400).json({
              message: 'Club name and user ID are required'
          });
      }

      
      const club = await Club.findOne({ 
          name: clubName,
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

      if (club.clubMembers.includes(userId)) {
          return res.status(400).json({ message: 'User is already a member of this club' });
      }

     

 
      club.clubMembers.push(userId);
      await club.save();

    
      user.clubAffiliation = clubName;
      await user.save();

     
      const updatedClub = await Club.findById(club._id)
          .populate('clubLeadId', 'email role')
          .populate('clubMembers', 'email role');

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


module.exports = { getAllclubs, createClub, addMemberToClub };