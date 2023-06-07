import express from 'express';
import multer from 'multer';
import { prisma } from '../app';

import { UploadController } from '../s3/bucketController';
// import { multerConfig } from './multerConfig';

const router = express.Router();

//TODO: r u sure???
const upload = multer({ dest: 'uploads/' });
// const upload = multer(multerConfig.fileFilter);

router.post("/upload", upload.single('uploaded_file'), UploadController.Upload);

router.get("/", function (req, res) {
  return res.json({ veryCoolGreeting: "yo yo yo" });
});

router.post("/", function (req, res) {
  return res.json({ veryCoolGreeting: "yo yo yo" });
});

export { router as userRoutes };