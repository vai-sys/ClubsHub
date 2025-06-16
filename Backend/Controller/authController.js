const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET, JWT_EXPIRATION, UserRoles } = require('../config/constants');
const Club=require("../models/Club")

const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email
  };
  
   
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });


};

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  } else if (authHeader) {
   
    return authHeader;
  }
  return req.cookies?.token || null;
};

exports.register = async (req, res) => {
  try {
    const { 
      name,
      email, 
      password, 
      role, 
      department,
    } = req.body;
    console.log("JWT Secret:", process.env.JWT_SECRET); 
   
    if (!name || !email || !password || !department) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }
    
    if (role && !Object.values(UserRoles).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || UserRoles.MEMBER,
      department,
      clubAffiliations: [], 
      isActive: true
    });

    await user.save();

    const token = generateToken(user);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(JWT_EXPIRATION, 10) * 1000,
    });
 
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        clubAffiliations: user.clubAffiliations,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("user",user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(JWT_EXPIRATION, 10) * 1000,
    });

    res.json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        clubAffiliations: user.clubAffiliations,
        lastLogin: user.lastLogin,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
   
    
    const token = getTokenFromRequest(req);
   
  
  
  
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User profile fetched successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        image:user.image,
        clubAffiliations: user.clubAffiliations,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        isActive: user.isActive
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
   
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allowedUpdates = {
      name: req.body.name,
      department: req.body.department,
      year: req.body.year
    };
  
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        year: updatedUser.year,
        clubAffiliations: updatedUser.clubAffiliations,
        lastLogin: updatedUser.lastLogin,
        isActive: updatedUser.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({
      message: 'Logout failed',
      error: error.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Not Authenticated" });
    }
   
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    res.status(200).json({
      message: "User details fetched successfully!",
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.updateProfilePicture = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No profile picture provided' });
    }
    
    const profilePicturePath = `/${req.file.path.replace(/\\/g, '/')}`;
    
   
    if (user.image && user.image !== profilePicturePath && user.image !== '') {
      try {
        const oldImagePath = path.join(__dirname, '..', user.image.substring(1));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.log('Error deleting old image: ', err.message);
       
      }
    }
    
  
    user.image = profilePicturePath;
    console.log("user", user);
   
    await user.save();
    
    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        clubAffiliations: user.clubAffiliations,
        image: user.image,
        lastLogin: user.lastLogin,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({
      message: 'Failed to update profile picture',
      error: error.message,
    });
  }
};


exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
   
    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 3 characters long'
      });
    }

   
    const currentUserId = req.user.id;


    const searchRegex = new RegExp(query, 'i');

   
    const users = await User.find({
      _id: { $ne: currentUserId }, 
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    })
    .select('_id name email profileImage')
    .limit(10); 

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.error('User search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching for users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
   
    const users = await User.find({}).select('name email role department year clubAffiliations image isActive lastLogin createdAt');
    
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });   
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message
    });
  }
};


exports.getEligibleUsers = async (req, res) => {
    try {
        const requestingUser = req.user;

      
        if (requestingUser.role !== 'superAdmin') {
            return res.status(403).json({
                message: 'Only super admins can fetch eligible users'
            });
        }

        const { clubId } = req.query;

        if (!clubId) {
            return res.status(400).json({
                message: 'Club ID is required'
            });
        }

      
        const club = await Club.findOne({ _id: clubId, isActive: true });

        if (!club) {
            return res.status(404).json({ message: 'Club not found or inactive' });
        }

        const existingMemberIds = club.clubMembers.map(member => member.student.toString());

        
        const eligibleUsers = await User.find({
            _id: { $nin: existingMemberIds },
            isActive: true
        }).select('_id name email role');

        res.status(200).json({
            message: 'Eligible users fetched successfully',
            eligibleUsers
        });

    } catch (error) {
        console.error('Error fetching eligible users:', error);
        res.status(500).json({
            message: 'Error fetching eligible users',
            error: error.message
        });
    }
};


