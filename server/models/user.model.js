const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  firstname: {
    type: String,
    maxLength: 100,
    trim: true,
    default: "",
  },
  lastname: {
    type: String,
    maxLength: 100,
    trim: true,
    default: "",
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.genAuthToken = function () {
  const body = { sub: this._id.toHexString(), email: this.email };
  const token = jwt.sign(body, process.env["JWT_PRIVATE_KEY"], {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.comparePassword = async function (candidate) {
  const match = await bcrypt.compare(candidate, this.password);
  return match;
};

userSchema.methods.genRegisterToken = function () {
  const body = { sub: this._id.toHexString() };
  const token = jwt.sign(body, process.env["JWT_PRIVATE_KEY"], {
    expiresIn: "1h",
  });

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
