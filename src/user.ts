import bcrypt from "bcrypt";
import { prisma } from "./app";
import { UnauthorizedError, NotFoundError } from "./expressError";


export async function authenticateUser(email: string, password: string) {
  let user;

  try {
    console.log("user email", email)
    user = await prisma.user.findUniqueOrThrow({
      where: { email: email }
    });

  } catch (err) {
    throw new NotFoundError()
  }


  if (user !== null) {
    // compare hashed password to a new hash from password
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid === true) {
      const userOutput: UserOutput = user;
      return userOutput;
    }
  }

  throw new UnauthorizedError("Invalid username/password");
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