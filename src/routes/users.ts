import express from 'express';
import multer from 'multer';
import { prisma } from '../app';
import { UploadController } from '../s3/bucketController';
import { ensureCorrectUser, ensureLoggedIn } from '../middleware/auth';

const router = express.Router();

//upload fike to s3
const upload = multer({ dest: 'uploads/' });

router.post("/upload", ensureLoggedIn, upload.single('uploaded_file'), UploadController.Upload);

//get all users
router.get("/", async function (req, res) {
  const allUsers = await prisma.user.findMany();
  return res.json(allUsers);
});

//create user
router.post("/", async function (req, res) {
  const newUser = await prisma.user.create({
    data: req.body
  });
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