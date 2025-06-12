const express = require("express");
const JoinRequest = require('../models/JoinRequest');
const Club = require("../models/Club");
const User = require("../models/User");
const { JWT_EXPIRATION, JWT_SECRET } = require("../config/constants");
const jwt = require('jsonwebtoken'); 



const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return req.cookies.token;
  };

 const sendJoinRequest = async (req, res) => {
    const { clubId } = req.params;
    const { userId } = req.body;

    if (!clubId || !userId) {
        return res.status(400).json({ 
            success: false,
            message: "Missing required fields: clubId or userId" 
        });
    }

    try {
        
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ 
                success: false,
                message: "Club not found" 
            });
        }

        
        if (club.clubMembers.some(member => member.student.toString() === userId)) {
            return res.status(409).json({ 
                success: false,
                message: "You are already a member of this club" 
            });
        }

       
        const existingRequest = await JoinRequest.findOne({
            userId,
            clubId,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(409).json({ 
                success: false,
                message: "Join request already pending" 
            });
        }

       
        const newJoinRequest = new JoinRequest({
            userId,
            clubId,
            requestDate: new Date(),
            status: "pending"
        });

        await newJoinRequest.save();

        return res.status(201).json({
            success: true,
            message: "Join request sent successfully",
            data: {
                requestId: newJoinRequest._id,
                userId,
                clubId,
                status: newJoinRequest.status,
                requestDate: newJoinRequest.requestDate
            }
        });

    } catch (error) {
        console.error("Error in sendJoinRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const getAllrequests=async (req,res)=>{
    const { clubId } = req.params;
    const  leadId  = req.user.id;
  
  
    try {
      const club = await Club.findById(clubId);
      if (!club) return res.status(404).json({ message: "Club not found" });
  
      if (club.clubLeadId.toString() !== leadId) {
        return res.status(403).json({ message: "Only the club lead can view requests" });
      }
  
      const requests = await JoinRequest.find({ clubId, status: "pending" }).populate('userId', 'name email image department year');
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
}


const respondToJoinRequest = async (req, res) => {
    const { clubId } = req.params;
    const { requestId, action } = req.body;
    const leadId=req.user.id;

    
    if (!clubId || !requestId || !action || !leadId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: clubId, requestId, action, or leadId"
        });
    }
  

    if (!['approved', 'rejected'].includes(action.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: "Invalid action. Must be either 'approved' or 'rejected'"
        });
    }

    try {
        
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }

        console.log({
            providedLeadId: leadId,
            actualLeadId: club.clubLeadId,
            providedLeadIdType: typeof leadId,
            actualLeadIdType: typeof club.clubLeadId
        });

      
        if (club.clubLeadId.toString() !== leadId) {
            return res.status(403).json({
                success: false,
                message: "Only the club lead can respond to requests"
            });
        }

    
        const request = await JoinRequest.findById(requestId);
        if (!request || request.clubId.toString() !== clubId) {
            return res.status(404).json({
                success: false,
                message: "Join request not found"
            });
        }

        
        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Request has already been ${request.status}`
            });
        }

       
        request.status = action.toLowerCase();
        request.respondedAt = new Date();
        await request.save();

        
        if (action.toLowerCase() === 'approved') {
          
            club.clubMembers.push({
                student: request.userId,
                joinDate: new Date()
            });
            await club.save();

            
            const user = await User.findById(request.userId);
            if (user) {
                user.clubAffiliations.push({
                    clubId: club._id,
                    clubName: club.name,
                    joinDate: new Date()
                });
                await user.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: `Request ${action.toLowerCase()} successfully`,
            data: {
                requestId: request._id,
                status: request.status,
                respondedAt: request.respondedAt
            }
        });

    } catch (error) {
        console.error("Error in respondToJoinRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
const getUserJoinReq = async (req, res) => {
  try {
    
    const rawRequests = await JoinRequest.find({ userId: req.user.id });
    console.log("Raw Join Requests:", rawRequests);

    const requests = await JoinRequest.find({ userId: req.user.id })
      .populate("clubId")
      .populate("userId");

    console.log(" Populated Join Requests:", requests);

 
    requests.forEach((req, index) => {
      console.log(`Request ${index + 1} - clubId:`, req.clubId);
    });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(" Error in getAllJoinRequestsForUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};






module.exports={sendJoinRequest,getAllrequests,respondToJoinRequest,getUserJoinReq};