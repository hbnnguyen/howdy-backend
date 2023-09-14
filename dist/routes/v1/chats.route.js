"use strict";
// import 'express-async-errors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = require("../../app");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
exports.chatRoutes = router;
//gets all of the current user's chats
router.get("/", auth_1.ensureLoggedIn, async function (req, res, next) {
    const userId = res.locals.user.id;
    const user = await app_1.prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        include: {
            chats: true
        }
    });
    return res.json({ chats: user.chats });
});
//get individual chat
router.get("/:id", auth_1.ensureLoggedIn, async function (req, res, next) {
    const userId = res.locals.user.id;
    const user = await app_1.prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        include: {
            chats: true,
        }
    });
    const chat = await app_1.prisma.chat.findFirst({
        where: {
            OR: [
                {
                    userOneId: userId,
                    userTwoId: Number(req.params.id)
                },
                {
                    userOneId: Number(req.params.id),
                    userTwoId: userId
                }
            ]
        },
        include: {
            messages: true
        }
    });
    // const chat = user.chats.filter(c => (c.userOneId === Number(req.params.id) || c.userTwoId === Number(req.params.id)));
    const messages = chat?.messages;
    // const chat = chats.
    return res.json;
});
//create chat
router.post("/:id", auth_1.ensureCorrectUser, async function (req, res, next) {
    const userId = res.locals.user.id;
    const chat = await app_1.prisma.chat.create({
        data: {
            userOneId: userId,
            userTwoId: Number(req.params.id)
        }
    });
    return res.json({ chat: chat });
});
