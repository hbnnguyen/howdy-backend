import bcrypt from "bcrypt";
import { prisma } from "./app";
import { UnauthorizedError, NotFoundError } from "./expressError";
import { User } from "@prisma/client";


export async function authenticateUser(email: string, password: string) {
  let user;

  console.log("user email", email);
  user = await prisma.user.findUniqueOrThrow({
    where: { email: email }
  });

  if (user !== null) {
    // compare hashed password to a new hash from password
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid === true) {
      return user;
    }
  }

  return null;
}

export function userToUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    zipCode: user.zipCode,
    bio: user.bio,
    hobbies: user.hobbies,
    interests: user.interests,
    friendRadius: user.friendRadius,
    imageKey: user.imageKey,
  };
}

export interface UserOutput {
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  zipCode: string,
  bio: string,
  hobbies: string,
  interests: string,
  friendRadius: number,
  imageKey: string,
}