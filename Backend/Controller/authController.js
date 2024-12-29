const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET, JWT_EXPIRATION, UserRoles } = require('../config/constants');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.cookies.token;
};

exports.register = async (req, res) => {
  try {
    const { 
      name,
      email, 
      password, 
      role, 
      department,
      year
    } = req.body;

   
    if (!name || !email || !password || !department || !year) {
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
      year,
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
        year: user.year,
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
        year: user.year,
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
   
    const user = await User.findById(decoded.userId);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User profile fetched successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
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
    const user = await User.findById(decoded.userId);

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
      decoded.userId,
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