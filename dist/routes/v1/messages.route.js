"use strict";
// import 'express-async-errors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = require("../../app");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
exports.messageRoutes = router;
//get messages from chat id
router.get("/:id", auth_1.ensureLoggedIn, async function (req, res, next) {
    const chat = await app_1.prisma.chat.findUnique({
        where: {
            id: Number(req.params.id)
        },
        include: {
            messages: {
                orderBy: {
                    timestamp: 'desc'
                }
            }
        }
    });
    const messages = chat?.messages;
    return res.json({ messages: messages });
});
//create message in specified chat
router.post("/:id", auth_1.ensureLoggedIn, async function (req, res, next) {
    const userId = res.locals.user.id;
    const message = await app_1.prisma.message.create({
        data: {
            authorId: userId,
            chatId: Number(req.params.id),
            contents: req.body.messageContent
        }
    });
    return res.json({ message: message });
});
