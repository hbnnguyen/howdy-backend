// import 'express-async-errors';

import express from 'express';
import multer from 'multer';
import { prisma } from '../../app';
import { UploadController } from '../../s3/bucketController';
import { ensureCorrectUser, ensureLoggedIn } from '../../middleware/auth';
import { NotFoundError } from '../../expressError';
import { UserOutput, userToUserOutput } from '../../user';

const router = express.Router();

//upload file to s3
const upload = multer({ dest: '/tmp/' });

router.post("/uploadProfilePic", ensureLoggedIn, upload.single('image'), UploadController.Upload);

// get all users
router.get("/", async function (req, res) {
  const allUsers = await prisma.user.findMany();
  return res.json(allUsers);
});

router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  console.log("USERS/GET ONE BY id!");

  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id)
    }
  });

  if (!user) {
    return next(new NotFoundError());
  }

  return res.json({ user: await userToUserOutput(user) });
  // return res.json({ user });
});


//create user
// router.post("/", async function (req, res) {
//   const newUser = await prisma.user.create({
//     data: req.body
//   });
//   return res.json(newUser);
// });

//update user
// router.patch("/", async function (req, res) {
//   const newUser = await prisma.user.create({
//     data: req.body
//   })
//   return res.json(newUser);
// });



export { router as userRoutes };