import jwt from "jsonwebtoken"
import config from "../config"

/** return signed JWT {username, isAdmin} from user data. */

export function createToken(email: string) {
  const payload = {
    email
  };

  return jwt.sign(payload, config.SECRET_KEY);
}