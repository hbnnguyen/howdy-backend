import { S3 } from "aws-sdk";
import fs from 'fs';
import config from "../config";
import { v4 as uuid } from "uuid";
import { prisma } from "../app";
import { User } from "@prisma/client";
import { userInfo } from "os";

/**
  * @name uploadToS3
  * @param {S3} s3
  * @param {File} fileData
  * @returns {Promise<{success:boolean; message: string; data: object;}>}
*/
async function uploadToS3(s3: S3, email: string, fileData?: Express.Multer.File) {
  try {
    const fileContent = fs.readFileSync(fileData!.path);

    //FIXME: handle null???

    const fname = fileData!.originalname;
    const extensionStartIdx = fname.lastIndexOf(".");
    const extension = fname.substring(extensionStartIdx);

    const fileKey = uuid() + extension;

    //TODO: make key a UUID
    const params = {
      Bucket: config.bucket_name,
      Key: fileKey,
      Body: fileContent
    };

    // const downloadParams = {
    //   Bucket: config.bucket_name,
    //   Key: fileData!.originalname, //pass in id here
    //   Expires: 3600,
    //   ResponseContentDisposition: `attachment; filename="filename.jpg"`
    // };
    // const url = s3.getSignedUrl('getObject', downloadParams);
    // url: url


    try {
      const res = await s3.upload(params).promise();

      await prisma.user.update({
        where: {
          email
        },
        data: {
          imageKey: fileKey
        }
      });

      console.log("File Uploaded with Successful", res.Location);

      return {
        success: true,
        message: "File Uploaded with Successful",
        data: res.Location,
      };
    } catch (error) {
      return { success: false, message: "Unable to Upload the file", data: error };
    }
  } catch (error) {
    return { success: false, message: "Unable to access this file", data: {} };
  }

}

export default uploadToS3;