"use strict";
// import 'express-async-errors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeDislikeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = require("../../app");
const auth_1 = require("../../middleware/auth");
const expressError_1 = require("../../expressError");
const router = express_1.default.Router();
exports.likeDislikeRoutes = router;
//create likedislike
router.post("/", auth_1.ensureLoggedIn, async function (req, res, next) {
    const { toUserId, liked } = req.body;
    const userId = res.locals.user.id;
    let newLikeDislike;
    try {
        newLikeDislike = await app_1.prisma.likeDislike.create({
            data: {
                fromUserId: userId,
                toUserId,
                liked
            }
        });
    }
    catch (err) {
        return next(new expressError_1.BadRequestError());
    }
    const userLikes = await app_1.prisma.likeDislike.findMany({
        where: {
            OR: [
                {
                    liked: true,
                    fromUserId: userId,
                    toUserId
                },
                {
                    liked: true,
                    fromUserId: toUserId,
                    toUserId: userId
                }
            ]
        }
    });
    const becameFriends = userLikes.length === 2;
    return res.json({ likeDislike: newLikeDislike, becameFriends });
});
