import { Document } from "mongoose";
import { IUser } from "../../interfaces/user.interface";

export const toUserResponse = (user: Document): IUser => {
  const userObject = user.toJSON();
  return {
    ...userObject,
    _id: userObject._id.toString(),
  } as IUser;
};
