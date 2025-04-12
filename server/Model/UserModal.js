const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: String,
    enum: ['normal', 'manager', 'admin'],
    default: 'normal'
  },
    isActive: {
      type: Boolean,
      default: false 
    },
  
  organizationalUnits: [
    {
      type: String,
      enum: [
        'News Management',
        'Software Reviews',
        'Hardware Reviews',
        'Opinion Publishing'
      ]
    }
  ],
  divisions: [
    {
      type: String,
      enum: [
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
      ]
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
