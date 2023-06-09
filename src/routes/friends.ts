import express from 'express';
import { prisma } from '../app';
import { ensureCorrectUser, ensureLoggedIn } from '../middleware/auth';
import { NotFoundError } from '../expressError';
import { userToUserOutput } from '../user';
import { asyncFilter } from '../helpers/asyncFilter';

const router = express.Router();

//gets all friends
router.get("/", ensureLoggedIn, async function (req, res, next) {
  const userId = res.locals.user.id;

  const users = await prisma.user.findMany({
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

  const matches = await asyncFilter(users, async (otherUser) => {
    const likesDislikesOther = await prisma.likeDislike.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: userId,
          toUserId: otherUser.id
        }
      }
    });

    const likeDislikedByOther = await prisma.likeDislike.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: otherUser.id,
          toUserId: userId,
        }
      }
    });

    return (likesDislikesOther?.liked && likeDislikedByOther?.liked) || false;
  });

  const promises = matches.map(userToUserOutput);
  const matchesWithPics = await Promise.all(promises);

  return res.json({ matches: matchesWithPics });
});

router.get("/nextPotential", ensureLoggedIn, async function (req, res, next) {
  const userId = res.locals.user.id;

  //FIXME: make this disaster more efficient

  const users = await prisma.user.findMany({
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

  const newUsers = await asyncFilter(users, async (otherUser) => {
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

    return true;
  });

  const potential = newUsers.length !== 0 ? userToUserOutput(newUsers[0]) : null;

  return res.json({ user: potential });
});

export { router as friendRoutes };