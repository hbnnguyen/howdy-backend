import express from 'express';
import { prisma } from '../app';
import { ensureCorrectUser, ensureLoggedIn } from '../middleware/auth';
import { NotFoundError } from '../expressError';
import { userToUserOutput } from '../user';

const router = express.Router();

//gets all friends
router.get("/", ensureLoggedIn, async function (req, res, next) {

})

router.get("/nextPotential", ensureLoggedIn, async function (req, res, next) {
    const userId = res.locals.user.id

    //FIXME: make this disaster more efficient

    const users = await prisma.user.findMany({
        include: {
            likedBy: true,
            usersLiked: true
        }
    });

    //TODO: make one query?



    const newusers = users.filter(async (otherUser) => {
        const likesDislikesOther = await prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: userId,
                    toUserId: otherUser.id
                }
            }
        });

        const likeDislikedByOther = (await prisma.likeDislike.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: otherUser.id,
                    toUserId: userId,
                }
            }
        }));

        const disliked = !likeDislikedByOther?.liked ?? false;

        if (likesDislikesOther || !disliked) {
            return false;
        }

        return true
    });

    const potential = newusers.length !== 0 ? userToUserOutput(newusers[0]) : null;

    return res.json({ user: potential });
});

export { router as friendRoutes };