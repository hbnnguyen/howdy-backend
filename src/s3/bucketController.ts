import { S3 } from 'aws-sdk';
import { Request } from "express";
import uploadToS3 from "./uploadToS3";
import config from "../config";

export class UploadController {

    static s3 = new S3({
        accessKeyId: config.access_key_id,
        secretAccessKey: config.secret_access_key,
    });

    static async Upload(req: Request, res: any) {

        // const s3 = new S3({
        //     accessKeyId: config.aws_access_key_id,
        //     secretAccessKey: config.aws_secret_access_key,
        // });

        // get file data through req.file thank to multer
        console.log("file stobject", req.file);

        const upload = await uploadToS3(UploadController.s3, res.locals.user.id, req.file);

        if (upload.success) {
            res.status(200).json(upload);
        } else {
            res.status(400).json(upload);
        }
    }
}