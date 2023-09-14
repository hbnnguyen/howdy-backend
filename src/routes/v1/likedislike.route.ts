// import 'express-async-errors';

import express from 'express';
import { prisma } from '../../app';
import { ensureLoggedIn } from '../../middleware/auth';
import { BadRequestError } from '../../expressError';
const router = express.Router();

//create likedislike
router.post("/", ensureLoggedIn, async function (req, res, next) {
  const { toUserId, liked } = req.body;

  const userId = res.locals.user.id;

  let newLikeDislike;
  try {
    newLikeDislike = await prisma.likeDislike.create({
      data: {
        fromUserId: userId,
        toUserId,
        liked
      }
    });
  } catch (err) {
    return next(new BadRequestError());
  }

  const userLikes = await prisma.likeDislike.findMany({
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

export { router as likeDislikeRoutes };