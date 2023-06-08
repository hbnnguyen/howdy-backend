import { S3 } from 'aws-sdk';
import { Request } from "express";
import uploadToS3 from "./uploadToS3";
import config from "../config";

export class UploadController {
    static async Upload(req: Request, res: any) {

        const s3 = new S3({
            accessKeyId: config.aws_access_key_id,
            secretAccessKey: config.aws_secret_access_key,
        });

        // get file data through req.file thank to multer
        console.log("file stobject", req.file);

        const uplaodRes = await uploadToS3(s3, res.locals.user.id, req.file);

        if (uplaodRes.success) {
            res.status(200).json(uplaodRes);
        } else {
            res.status(400).json(uplaodRes);
        }
    }
}