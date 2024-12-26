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
    const { email, password, role, clubAffiliation } = req.body;


    if (!Object.values(UserRoles).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({
      email,
      password: hashedPassword,
      role: role || UserRoles.STUDENT,
      clubAffiliation: clubAffiliation || null, 
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
        email: user.email,
        role: user.role,
        clubAffiliation: user.clubAffiliation,
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
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        clubAffiliation: user.clubAffiliation,
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
        email: user.email,
        role: user.role,
        clubAffiliation: user.clubAffiliation,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

exports.UpdateProfile = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded);

    
    const userExists = await User.findById(decoded.userId);
    console.log("id",decoded.userId)
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedData = await User.findByIdAndUpdate(
      decoded.userId,
      { clubAffiliation: req.body.clubAffiliation },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(400).json({ message: 'Failed to update profile' });
    }

    console.log("Updated Data:", updatedData);
    return res.status(200).json({
      message: "Profile changed successfully",
      user: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};
