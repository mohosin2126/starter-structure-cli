import jwt from "jsonwebtoken";

export default function generateToken(userId: number) {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn
  });
}
