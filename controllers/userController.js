const User = require('../models/userModel');
const cloudinary = require('../lib/cloudinary');
const streamifier = require('streamifier');
const bcrypt = require('bcryptjs');

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only JPEG, PNG, and GIF images are allowed' 
      });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image size must be less than 5MB' 
      });
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'profile_pics',
            transformation: { width: 500, height: 500, crop: 'limit' }
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const user = await User.findById(req.params.userId);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profilePic: result.secure_url },
      { new: true }
    );

    if (user.profilePic) {
      const publicId = user.profilePic.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`profile_pics/${publicId}`);
    }

    res.status(200).json({ 
      success: true, 
      data: {
        user: updatedUser,
        imageUrl: result.secure_url
      } 
    });
  } catch (err) {
    console.error('Profile pic upload error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload profile picture',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

  
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};



const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  uploadProfilePic,
  getAllUsers,
  getUserById,
  updateUser,
  changePassword,
  deleteUser
};
