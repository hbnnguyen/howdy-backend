"use strict";
// import 'express-async-errors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRoutes = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = require("../../app");
const auth_1 = require("../../middleware/auth");
const user_1 = require("../../user");
const asyncFilter_1 = require("../../helpers/asyncFilter");
const router = express_1.default.Router();
exports.friendRoutes = router;
//gets all friends
router.get("/", auth_1.ensureLoggedIn, async function (req, res, next) {
    const userId = res.locals.user.id;
    const users = await app_1.prisma.user.findMany({
        where: {
            NOT: {
                id: userId
            }
        },
        include: {
            likedBy: true,
            usersLiked: true
        }
    });
    const matches = await (0, asyncFilter_1.asyncFilter)(users, async (otherUser) => {
        const likesDislikesOther = await app_1.prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: userId,
                    toUserId: otherUser.id
                }
            }
        });
        const likeDislikedByOther = await app_1.prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: otherUser.id,
                    toUserId: userId,
                }
            }
        });
        return (likesDislikesOther?.liked && likeDislikedByOther?.liked) || false;
    });
    const promises = matches.map(user_1.userToUserOutput);
    const matchesWithPics = await Promise.all(promises);
    return res.json({ matches: matchesWithPics });
});
router.get("/nextPotential", auth_1.ensureLoggedIn, async function (req, res, next) {
    const userId = res.locals.user.id;
    //FIXME: make more efficient
    const otherUsers = await app_1.prisma.user.findMany({
        where: {
            NOT: {
                id: userId
            }
        },
        include: {
            likedBy: true,
            usersLiked: true
        }
    });
    //TODO: make one query?
    const newUsers = await (0, asyncFilter_1.asyncFilter)(otherUsers, async (otherUser) => {
        const likesDislikesOther = await app_1.prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: userId,
                    toUserId: otherUser.id
                }
            }
        });
        const likeDislikedByOther = (await app_1.prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: otherUser.id,
                    toUserId: userId,
                }
            }
        }));
        const otherDislikesMe = likeDislikedByOther != null && !likeDislikedByOther.liked;
        if (likesDislikesOther != null || otherDislikesMe) {
            return false;
        }
        return true;
    });
    const potential = newUsers.length !== 0 ? await (0, user_1.userToUserOutput)(newUsers[0]) : null;
    return res.json({ user: potential });
});
