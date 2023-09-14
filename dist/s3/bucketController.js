"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const aws_sdk_1 = require("aws-sdk");
const uploadToS3_1 = __importDefault(require("./uploadToS3"));
const config_1 = __importDefault(require("../config"));
class UploadController {
    static s3 = new aws_sdk_1.S3({
        accessKeyId: config_1.default.access_key_id,
        secretAccessKey: config_1.default.secret_access_key,
    });
    static async Upload(req, res) {
        // const s3 = new S3({
        //     accessKeyId: config.aws_access_key_id,
        //     secretAccessKey: config.aws_secret_access_key,
        // });
        // get file data through req.file thank to multer
        console.log("file stobject", req.file);
        const upload = await (0, uploadToS3_1.default)(UploadController.s3, res.locals.user.id, req.file);
        if (upload.success) {
            res.status(200).json(upload);
        }
        else {
            res.status(400).json(upload);
        }
    }
}
exports.UploadController = UploadController;
