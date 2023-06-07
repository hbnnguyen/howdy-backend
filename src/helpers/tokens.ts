import jwt from "jsonwebtoken"
import config from "../config"
import { User } from "@prisma/client";

/** return signed JWT {username, isAdmin} from user data. */

function createToken(user: User) {
  let payload = {
    email: user.email
  };

  return jwt.sign(payload, config.SECRET_KEY);
}

module.exports = { createToken };
