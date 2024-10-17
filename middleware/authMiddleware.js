const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header is present and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next middleware/route handler
      next();
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // If token is not provided, respond with an error
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

module.exports = { protect };
