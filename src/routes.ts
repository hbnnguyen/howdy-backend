import express from 'express';
import multer from 'multer';

import { UploadController } from './bucketController';
import { multerConfig } from './multerConfig';

const router = express.Router();

//TODO: r u sure???
const upload = multer({ dest: 'uploads/' })
// const upload = multer(multerConfig.fileFilter);

router.post("/upload", upload.single('uploaded_file'), UploadController.Upload);

export { router };