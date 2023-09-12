import 'express-async-errors'
import express, { ErrorRequestHandler, NextFunction, Request, Response, response } from "express";
import cors from "cors";

import { userRoutes } from "./routes/users";
import { authRoutes } from "./routes/auth";
import { friendRoutes } from "./routes/friends";
import { likeDislikeRoutes } from "./routes/likedislike";
import { messageRoutes } from "./routes/messages";
import { chatRoutes } from "./routes/chats";
import { ExpressError, NotFoundError } from "./expressError";
import { PrismaClient } from "@prisma/client";
import { authenticateJWT } from "./middleware/auth";

export const prisma = new PrismaClient();

const app = express();

app.use(cors()); // Enable all cors requests for all routes
app.use(express.json());
app.use(authenticateJWT);

app.use(express.urlencoded({ limit: '50000mb', extended: false }));
// user route for all path

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/likeDislike", likeDislikeRoutes);
app.use("/friends", friendRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);

app.get("*", (req, res, next) => {
  return next(new NotFoundError());
});

//FIXME: fix error handling ???


/** Generic error handler; anything unhandled goes here. */
app.use(function (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("shagua");
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });

} as ErrorRequestHandler);

export { app };