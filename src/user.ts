import bcrypt from "bcrypt";
import { prisma } from "./app";
import { UnauthorizedError, NotFoundError } from "./expressError";


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
      const userOutput: UserOutput = user;
      return userOutput;
    }
  }

  return null;
}

export interface UserOutput {
  email: string,
  firstName: string,
  lastName: string,
  zipCode: string,
  bio: string | null,
  hobbies: string | null,
  interests: string | null,
  friendRadius: number | null;
}