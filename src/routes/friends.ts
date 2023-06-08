import express from 'express';
import { prisma } from '../app';
import { ensureCorrectUser, ensureLoggedIn } from '../middleware/auth';
import { NotFoundError } from '../expressError';
import { userToUserOutput } from '../user';

const router = express.Router();

router.get("/nextPotential", ensureLoggedIn, async function (req, res, next) {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(res.locals.user.id)
        }
    });

    if (!user) {
        return next(new NotFoundError());
    }

    //FIXME: make this disaster more efficient

    const users = await prisma.user.findMany({
        include: {
            likedBy: true,
            usersLiked: true
        }
    });

    //TODO: make one query?

    users.filter(async (otherUser) => {
        const likesDislikesOther = await prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: user.id,
                    toUserId: otherUser.id
                }
            }
        });

        const likeDislikedByOther = (await prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: otherUser.id,
                    toUserId: user.id,
                }
            }
        }));

        const disliked = !likeDislikedByOther?.liked ?? false;

        if (likesDislikesOther || !disliked) {
            return false;
        }
    });

    const potential = users.length === 0 ? userToUserOutput(users[0]) : null;

    return res.json({ user: potential });
});

export { router as friendRoutes };