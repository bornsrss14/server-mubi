import User from "../models/userModel.js";
import bcrypt from "bcrypt"; //externo

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

{
  /* while no have mongo or another database integrated i need to import fsPromises, working with simple files in file sistems
  const (fsPromises = require('fs').promises;
  import path from "path";
  */
}

export const authByNicknameAndPwd = async (req, res) => {
  try {
    const { username, password_hash } = req.body;

    if (!username || !password_hash) {
      return res.status(400).json({
        success: false,
        message: "both fields are required",
      });
    }

    const userRecord = await User.findByUsername(username);

    if (!userRecord) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    let isMatch = false;

    // Detectar si es bcrypt
    const isHashed = userRecord.password_hash.startsWith("$2");

    if (!isHashed) {
      // TEXTO PLANO en BD
      if (password_hash === userRecord.password_hash) {
        isMatch = true;

        // Rehash automático
        const newHash = await bcrypt.hash(password_hash, 10);
        await User.updatePwd(newHash, userRecord.username);
      }
    } else {
      // HASH en BD
      isMatch = await bcrypt.compare(
        password_hash, // texto plano del request
        userRecord.password_hash, // hash en BD
      );
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // MISMO flujo para ambos casos
    const accessToken = jwt.sign(
      { username: userRecord.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { username: userRecord.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "Lax", //➜ mi cookie va a pasar (viajar) entre dominios //sería "None"
      secure: false, // ➜ por el momento estoy en localhost http // sería true
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//este end point usa la cookie para generar un nuevo accessToken
export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.dotenv.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(
        {
          userInfo: { username: decoded.username },
        },
        process.dotenv.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );
      res.json({ accessToken });
    },
  );
};

//logout — limpiar cookie

export const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true });
  res.json({ message: "cookie cleared" });
};

export default authByNicknameAndPwd;
