"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
const uuid_1 = require("uuid");
const app_1 = require("../app");
const user_1 = require("../user");
/**
  * @name uploadToS3
  * @param {S3} s3
  * @param {File} fileData
  * @returns {Promise<{success:boolean; message: string; data: object;}>}
*/
async function uploadToS3(s3, id, fileData) {
    try {
        const fileContent = fs_1.default.readFileSync(fileData.path);
        //FIXME: handle null???
        const fname = fileData.originalname;
        const extensionStartIdx = fname.lastIndexOf(".");
        const extension = fname.substring(extensionStartIdx);
        const fileKey = (0, uuid_1.v4)() + extension;
        const params = {
            Bucket: config_1.default.bucket_name,
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
            await app_1.prisma.user.update({
                where: {
                    id
                },
                data: {
                    imageKey: fileKey
                }
            });
            console.log("File Uploaded with Successful", res.Location);
            const imageURL = await (0, user_1.getUserPicture)(id);
            return {
                success: true,
                message: "File Uploaded with Successful",
                imageURL
            };
        }
        catch (error) {
            return { success: false, message: "Unable to Upload the file", data: error };
        }
    }
    catch (error) {
        return { success: false, message: "Unable to access this file", data: {} };
    }
}
exports.default = uploadToS3;
