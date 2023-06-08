import jwt from "jsonwebtoken";
import config from "../config";
import { User } from "@prisma/client";

/** return signed JWT {username, isAdmin} from user data. */

export function createToken(user: User) {
  const payload = {
    id: user.id
  };

  return jwt.sign(payload, config.SECRET_KEY);
}