import express from 'express';
import multer from 'multer';
import { prisma } from '../app';

import { UploadController } from '../s3/bucketController';
// import { multerConfig } from './multerConfig';

const router = express.Router();

//upload fike to s3
const upload = multer({ dest: 'uploads/' });
// const upload = multer(multerConfig.fileFilter);

router.post("/upload", upload.single('uploaded_file'), UploadController.Upload);

//get all users
router.get("/", async function (req, res) {
  const allUsers = await prisma.user.findMany()
  return res.json(allUsers);
});

//create user
router.post("/", async function (req, res) {
  const newUser = await prisma.user.create({
    data: req.body
  })
  return res.json(newUser);
});

//update user
// router.patch("/", async function (req, res) {
//   const newUser = await prisma.user.create({
//     data: req.body
//   })
//   return res.json(newUser);
// });

export { router as userRoutes };