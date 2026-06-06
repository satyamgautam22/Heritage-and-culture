import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import dotenv from "dotenv";
import requestIp from "request-ip"
import axios from "axios";
dotenv.config();

// REGISTER 
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
   

    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "User created." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

   
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: "user",
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        role: "user",
        name:user.name,
        email:user.email
        
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    return res.json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } 
};

//get all users in the system
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

//to get user's ip address
export const getMyIp = async (req, res) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;

    // remove ::ffff:
    if (ip?.includes("::ffff:")) ip = ip.replace("::ffff:", "");

    // if local testing
    const url =
      ip === "::1" || ip === "127.0.0.1"
        ? "https://ipapi.co/json/"
        : `https://ipapi.co/${ip}/json/`;

    const response = await axios.get(url);

    res.json({
      ip,
      location: {
        city: response.data.city,
        region: response.data.region,
        country: response.data.country_name,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        isp: response.data.org,
      },
    });
  } catch (error) {
    console.log("Location Error:", error.message);
    res.status(500).json({ message: "Failed to fetch location" });
  }
}