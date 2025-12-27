/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  return jwt.sign(payload, secret as any, { expiresIn } as any);
};

const verifyToken = (token: string, secret: Secret) => {
  const tokenWithoutQuotes = token.replace(/^"|"$/g, "");

  const verifiedUser = jwt.verify(tokenWithoutQuotes, secret) as JwtPayload;

  return verifiedUser;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
