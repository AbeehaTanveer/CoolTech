const User = require('../Model/UserModal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config(); 
const JWT_SECRET = process.env.JWT_SECRET;





// Admin approval and assignment controller
exports.approveAndAssignUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roles, organizationalUnits, divisions } = req.body;

    // Validate required fields
    if (!roles || !organizationalUnits || !divisions) {
      return res.status(400).json({ 
        success: false,
        message: 'Role, organizational units and divisions are required' 
      });
    }

    // Validate enum values
    const validRoles = ['normal', 'manager', 'admin'];
    const validOUs = [
      'News Management',
      'Software Reviews',
      'Hardware Reviews',
      'Opinion Publishing'
    ];
    const validDivisions = [
      'Finance',
      'IT Support',
      'Content Writing',
      'Editing and Proofreading',
      'Marketing and Promotion',
      'Research and Development',
      'Quality Assurance',
      'User Experience (UX) Design',
      'Analytics and Reporting',
      'Legal and Compliance',
      'Community Engagement'
    ];

    if (!validRoles.includes(roles)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Check if all OUs are valid
    const invalidOUs = organizationalUnits.filter(ou => !validOUs.includes(ou));
    if (invalidOUs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid organizational units: ${invalidOUs.join(', ')}`
      });
    }

    // Check if all divisions are valid
    const invalidDivisions = divisions.filter(div => !validDivisions.includes(div));
    if (invalidDivisions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid divisions: ${invalidDivisions.join(', ')}`
      });
    }

    // Update user with new assignments
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        roles,
        organizationalUnits,
        divisions,
        isActive: true // Approve the user
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

 

    res.status(200).json({
      success: true,
      message: 'User approved and assigned successfully',
    
      user: updatedUser
    });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve and assign user',
      error: error.message
    });
  }
};




// Register Controller 
exports.register = async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
  
      // Validate required fields
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password (ensure it's a string)
      const hashedPassword = await bcrypt.hash(String(password), 10);
  
      // Create and save the user
      const user = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      await user.save();
      
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.roles },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(201).json({ token, user });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  };


// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare the password
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // 👉 Check and update admin role if special credentials match
    if (email === 'adminCoolTech@gmail.com' && password === 'admin123' && user.roles !== 'admin') {
      user.roles = 'admin';
      await user.save(); // Save updated role to database
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.roles }, JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};



// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ roles: { $ne: 'admin' } }) // Exclude admins
      .select('-password') // Hide password
      .sort({ createdAt: -1 }); // Sort by latest

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

 


  // Get Single User by ID (Admin Only or Self)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: err.message });
  }
};