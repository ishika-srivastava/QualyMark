const User = require("../model/user.model");
const jwt = require("jsonwebtoken");

const signToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = signToken(user._id, user.isCompany);
    res.json({ token }).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const registerUser = async (req, res) => {
  const { name, email, password, isCompany } = req.body;
  try {
    const user = await User.register(name, email, password, isCompany);
    const token = signToken(user._id);
    res.json({ token }).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

module.exports = { loginUser, registerUser };
