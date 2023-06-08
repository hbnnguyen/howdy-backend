import express from 'express';
import { prisma } from '../app';
import { ensureLoggedIn } from '../middleware/auth';
import { BadRequestError } from '../expressError';
const router = express.Router();

//create likedislike
router.post("/", ensureLoggedIn, async function (req, res, next) {
  const { toUserId, liked } = req.body;

  let newLikeDislike;
  try {
    newLikeDislike = await prisma.likeDislike.create({
      data: {
        fromUserId: res.locals.user.id,
        toUserId,
        liked
      }
    });
  } catch(err) {
    return next(new BadRequestError())
  }

  return res.json({likeDislike: newLikeDislike})
});

export { router as likeDislikeRoutes };