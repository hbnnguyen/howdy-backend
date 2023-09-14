"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPicture = exports.getSignedPictureByImageKey = exports.userToUserOutput = exports.authenticateUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
const bucketController_1 = require("./s3/bucketController");
async function authenticateUser(email, password) {
    let user;
    user = await app_1.prisma.user.findUniqueOrThrow({
        where: { email: email }
    });
    if (user !== null) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (isValid === true) {
            return user;
        }
    }
    return null;
}
exports.authenticateUser = authenticateUser;
async function userToUserOutput(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        imageKey: await getSignedPictureByImageKey(user.imageKey),
    };
}
exports.userToUserOutput = userToUserOutput;
async function getSignedPictureByImageKey(imageKey) {
    if (imageKey.trim() === "") {
        return ""; //FIXME: DEFAULT IMAGE
    }
    const downloadParams = {
        Bucket: config_1.default.bucket_name,
        Key: imageKey,
        Expires: 3600,
        ResponseContentDisposition: `attachment; filename="${imageKey}"`
    };
    const url = bucketController_1.UploadController.s3.getSignedUrl('getObject', downloadParams);
    return url;
}
exports.getSignedPictureByImageKey = getSignedPictureByImageKey;
async function getUserPicture(userId) {
    const user = await app_1.prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!user) {
        return ""; //FIXME: return default image
    }
    return getSignedPictureByImageKey(user.imageKey);
}
exports.getUserPicture = getUserPicture;
