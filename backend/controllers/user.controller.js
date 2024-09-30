const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY);
      res.status(200).json({ token, role:user.role });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const signup = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ email, password: hashedPassword, role });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_KEY);

    res.status(201).json({ token, role:newUser.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login, signup };
