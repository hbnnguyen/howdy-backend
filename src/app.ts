import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { userRoutes } from "./routes/users";
import { ExpressError, NotFoundError } from "./expressError";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const app = express();

app.use(cors()); // Enable all cors requests for all routes
app.use(express.json());

app.use(express.urlencoded({ limit: '50000mb', extended: false }));
// user route for all path

app.use("/users", userRoutes);

app.get("*", (req, res) => {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });

});

export { app };