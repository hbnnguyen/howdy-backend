"use strict";
/** Routes for authentication. */
// import 'express-async-errors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const jsonschema_1 = __importDefault(require("jsonschema"));
const express_1 = __importDefault(require("express"));
// import multer from 'multer';
const app_1 = require("../../app");
// import { UploadController } from '../s3/bucketController';
const userAuth_json_1 = __importDefault(require("../../schemas/userAuth.json"));
const userRegister_json_1 = __importDefault(require("../../schemas/userRegister.json"));
const expressError_1 = require("../../expressError");
const tokens_1 = require("../../helpers/tokens");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const user_1 = require("../../user");
const router = express_1.default.Router();
exports.authRoutes = router;
/** POST /auth/token:  { email, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/token", async function (req, res, next) {
    const validator = jsonschema_1.default.validate(req.body, userAuth_json_1.default, { required: true });
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return next(new expressError_1.BadRequestError(errs.toString()));
    }
    const { email, password } = req.body;
    let user;
    try {
        user = await (0, user_1.authenticateUser)(email, password);
    }
    catch (err) {
        return next(new expressError_1.UnauthorizedError());
    }
    if (!user) {
        return next(new expressError_1.UnauthorizedError());
    }
    const token = (0, tokens_1.createToken)(user);
    return res.json({ token });
});
/** POST /auth/register:   { user } => { token }
 *
 * must match the user registration schema
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/register", async function (req, res, next) {
    const validator = jsonschema_1.default.validate(req.body, userRegister_json_1.default, { required: true });
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return next(new expressError_1.BadRequestError(errs.toString()));
    }
    //FIXME: duplicate check for id
    //FIXME: move to separate file
    const data = req.body;
    const hashedPassword = await bcrypt_1.default.hash(req.body.password, config_1.default.BCRYPT_WORK_FACTOR);
    data.password = hashedPassword;
    // adds new user to db
    const newUser = await app_1.prisma.user.create({
        data
    });
    // adds email to separate table
    await app_1.prisma.userEmail.create({
        data: {
            email: data.email
        }
    });
    // adds username to separate table
    await app_1.prisma.username.create({
        data: {
            username: data.username
        }
    });
    const token = (0, tokens_1.createToken)(newUser);
    return res.status(201).json({ token });
});
router.get("/:username", async function (req, res, next) {
    console.log("USERS/GET ONE BY username!");
    const user = await app_1.prisma.user.findUnique({
        where: {
            username: String(req.params.username)
        }
    });
    if (!user) {
        return next(new expressError_1.NotFoundError());
    }
    return res.json({ username: user.username });
    // return res.json({ user });
});
