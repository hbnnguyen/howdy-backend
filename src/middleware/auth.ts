"use strict";

/** Convenience middleware to handle common auth cases in routes. */

import jwt from "jsonwebtoken";
import config from "../config";
import { UnauthorizedError } from "../expressError";
import { NextFunction, Request, Response } from "express";


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the id field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers?.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^[Bb]earer /, "").trim();

    try {
      res.locals.user = jwt.verify(token, config.SECRET_KEY);
    } catch (err) {
      /* ignore invalid tokens (but don't store user!) */
    }
  }
  return next();

}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

export function ensureLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.id) return next();
  return next(new UnauthorizedError());
}

/** Middleware to use when they must provide a valid token & be user matching
 *  id provided as route param.
 *
 *  If not, raises Unauthorized.
 */

export function ensureCorrectUser(req: Request, res: Response, next: NextFunction) {
  const id = res.locals.user?.id;
  if (id && (id === +req.params.id)) {
    return next();
  }

  return next(new UnauthorizedError());
}