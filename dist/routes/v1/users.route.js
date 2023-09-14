"use strict";
// import 'express-async-errors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const app_1 = require("../../app");
const bucketController_1 = require("../../s3/bucketController");
const auth_1 = require("../../middleware/auth");
const expressError_1 = require("../../expressError");
const user_1 = require("../../user");
const router = express_1.default.Router();
exports.userRoutes = router;
//upload file to s3
const upload = (0, multer_1.default)({ dest: '/tmp/' });
router.post("/uploadProfilePic", auth_1.ensureLoggedIn, upload.single('image'), bucketController_1.UploadController.Upload);
// get all users
router.get("/", async function (req, res) {
    const allUsers = await app_1.prisma.user.findMany();
    return res.json(allUsers);
});
router.get("/:id", auth_1.ensureCorrectUser, async function (req, res, next) {
    console.log("USERS/GET ONE BY id!");
    const user = await app_1.prisma.user.findUnique({
        where: {
            id: Number(req.params.id)
        }
    });
    if (!user) {
        return next(new expressError_1.NotFoundError());
    }
    return res.json({ user: await (0, user_1.userToUserOutput)(user) });
    // return res.json({ user });
});
