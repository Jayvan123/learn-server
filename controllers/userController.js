const User = require('../models/userModel'); // Adjust the path according to your project structure

// Controller function to search for users
const searchUsers = async (req, res) => {
    const { term } = req.query;

    if (!term) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    try {
        const regex = new RegExp(term, 'i');
        const users = await User.find({
            $or: [
                { firstName: regex },
                { lastName: regex },
            ],
        }).select('-password');

      

        res.json(users);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while searching for users' });
    }
};

module.exports = {
    searchUsers,
};
