/** Routes for authentication. */

import jsonschema from "jsonschema";

import express from 'express';
import multer from 'multer';
import { prisma } from '../app';

import { UploadController } from '../s3/bucketController';

import userAuthSchema from '../schemas/userAuth.json';
import userRegisterSchema from '../schemas/userRegister.json';
import { BadRequestError } from "../expressError";
import { createToken } from "../helpers/tokens";
import bcrypt from "bcrypt";
import config from "../config";

const router = express.Router();

/** POST /auth/token:  { username, password } => { token }
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
    throw new BadRequestError(errs.toString());
  }

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);

  

  const token = createToken(user);
  return res.json({ token });
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
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
    throw new BadRequestError(errs.toString());
  }

  //FIXME: duplicate check for email
  //FIXME: move to separate file
  const hashedPassword = await bcrypt.hash(req.body.password, config.BCRYPT_WORK_FACTOR);

  const data = req.body;
  data.password = hashedPassword;

  const newUser = await prisma.user.create({
    data
  });
  const token = createToken(data.email);
  return res.status(201).json({ token });
});

// router.post("/register", async function (req, res) {
//   const newUser = await prisma.user.create({
//     data: req.body
//   });
//   return res.json(newUser);
// });


export { router as authRoutes };
