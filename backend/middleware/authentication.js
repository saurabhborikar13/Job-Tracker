const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  // Check header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authentication invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const payload = jwt.verify(token, 'secret123'); // Must match the secret in auth.js
    
    // Attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    
    next(); // Pass control to the next handler (the jobs router)
  } catch (error) {
    return res.status(401).json({ msg: 'Authentication invalid' });
  }
}

module.exports = auth;