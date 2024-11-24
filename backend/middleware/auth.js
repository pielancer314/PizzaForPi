const piNetwork = require('../blockchain/piNetwork');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    // Verify with Pi Network
    const piUser = await piNetwork.authenticateUser(accessToken);
    
    // Find or create user in our database
    let user = await User.findOne({ piUserId: piUser.uid });
    
    if (!user) {
      user = new User({
        piUserId: piUser.uid,
        username: piUser.username,
        email: piUser.email || `${piUser.username}@placeholder.com`,
        profile: {
          firstName: piUser.firstName,
          lastName: piUser.lastName
        }
      });
      await user.save();
    }

    // Add user to request object
    req.user = user;
    req.piUser = piUser;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;
