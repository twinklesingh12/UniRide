import crypto from "crypto";
import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      tokenVersion: user.token_version,
      tokenType: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      tokenVersion: user.token_version,
      tokenType: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}