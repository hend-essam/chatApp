import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt-ts";

async function RegisterUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, profilePic } = req.body;
    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      res.status(400).json({ message: "Email already exists", error: true });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
      profilePic,
    };

    const user = await UserModel.create(payload);
    const userSaved = await user.save();

    res.status(201).json({
      message: "User created successfully",
      data: userSaved,
      success: true,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: errorMessage, error: true });
  }
}

export default RegisterUser;
