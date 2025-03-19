import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const avatar = req.file ? req.file.path : ""; // Get uploaded file path

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword, avatar });
    await user.save();

    return res.status(201).json({
      message: "User registered successfully, please log in",
      user: { id: user.id, name: user.name, email: user.email, avatar },
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Generate JWT Token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ 
      message: "User logged in successfully", 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};