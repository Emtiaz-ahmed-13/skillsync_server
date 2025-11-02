import { Request } from "express";
import { UserRole } from "./user.interface";

export interface IAuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export type ILoginRequest = {
  email: string;
  password: string;
};

export type IRegisterRequest = ILoginRequest & {
  name: string;
  role: UserRole;
};

export type IUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type IAuthResponse = {
  token: string;
  user: IUser;
};

export type IJwtPayload = {
  userId: string;
  role: UserRole;
};

export interface IAuthenticatedRequest extends Request {
  user?: Pick<IUser, "id" | "role">;
}
