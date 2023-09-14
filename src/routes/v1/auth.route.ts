/** Routes for authentication. */
// import 'express-async-errors';

import jsonschema from "jsonschema";

import express from 'express';
// import multer from 'multer';
import { prisma } from '../../app';

// import { UploadController } from '../s3/bucketController';

import userAuthSchema from '../../schemas/userAuth.json'
import userRegisterSchema from '../../schemas/userRegister.json';
import { BadRequestError, UnauthorizedError, NotFoundError } from "../../expressError";
import { createToken } from "../../helpers/tokens";
import bcrypt from "bcrypt";
import config from "../../config";
import { authenticateUser } from "../../user";

const router = express.Router();

/** POST /auth/token:  { email, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userAuthSchema,
    { required: true }
  );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    return next(new BadRequestError(errs.toString()));
  }

  const { email, password } = req.body;
  let user;
  try {
    user = await authenticateUser(email, password);
  } catch (err) {
    return next(new UnauthorizedError());
  }

  if (!user) {
    return next(new UnauthorizedError());
  }

  const token = createToken(user);

  return res.json({ token });
});


/** POST /auth/register:   { user } => { token }
 *
 * must match the user registration schema
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userRegisterSchema,
    { required: true }
  );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    return next(new BadRequestError(errs.toString()));
  }

  //FIXME: duplicate check for id
  //FIXME: move to separate file

  const data = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, config.BCRYPT_WORK_FACTOR);
  data.password = hashedPassword;

  // adds new user to db
  const newUser = await prisma.user.create({
    data
  });

  // adds email to separate table
  await prisma.userEmail.create({
    data: {
      email: data.email
    }
  })

  // adds username to separate table
  await prisma.username.create({
    data: {
      username: data.username
    }
  })

  const token = createToken(newUser);
  return res.status(201).json({ token });
});

router.get("/:username", async function (req, res, next) {
  console.log("USERS/GET ONE BY username!");

  const user = await prisma.user.findUnique({
    where: {
      username: String(req.params.username)
    }
  });

  if (!user) {
    return next(new NotFoundError());
  }

  return res.json({ username: user.username });
  // return res.json({ user });
});

// router.post("/register", async function (req, res) {
//   const newUser = await prisma.user.create({
//     data: req.body
//   });
//   return res.json(newUser);
// });


export { router as authRoutes };
