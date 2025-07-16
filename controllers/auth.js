import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logUserActivity } from "./userActivity.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    //if user didn't exist
    if (!user) return res.status(404).send("User not found");

    //to check if the provided password is correct
    const isPwdCorrect = await bcrypt.compare(password, user.password);

    //if password is incorrect
    if (!isPwdCorrect) return res.status(401).send("Incorrect password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    await logUserActivity({
      userId: user._id,
      action: "login",
      collection: "User",
      metadata: { userLoggedIn: req._id },
    });

    res.status(200).json({ message: "Succesful Login", token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
