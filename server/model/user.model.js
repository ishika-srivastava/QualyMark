const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: "",
    },
    isCompany: {
      type: Boolean,
      default: false,
    },
    isOauth: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Please provide email and password");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  return user;
};

userSchema.statics.register = async function (
  name,
  email,
  password,
  isCompany,
) {
  if (!name || !email || !password) {
    throw new Error("Please provide all fields");
  }

  const user = await this.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }
  if (user && user.isOauth) {
    throw new Error("User already exists with OAuth");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await this.create({
    name,
    email,
    password: hashedPassword,
    isCompany,
  });

  return newUser;
};

userSchema.statics.googleLogin = async function (
  name,
  email,
  isCompany = false
) {
  const user = await this.findOne({ email });
  if (!user) {
    return this.create({ name, email, isOauth: true, isCompany });
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
