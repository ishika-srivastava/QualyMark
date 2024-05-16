const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ err: "Authorization token required!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id });
    req.user = { _id: user._id, isCompany: user.isCompany };
    next();
  } catch (err) {
    res.status(401).json({ err: "Invalid or expired token!" });
  }
};

module.exports = requireAuth;
