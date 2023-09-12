import 'express-async-errors';

import express from 'express';
import { prisma } from '../app';
import { ensureCorrectUser, ensureLoggedIn } from '../middleware/auth';
import { NotFoundError } from '../expressError';
import { userToUserOutput } from '../user';
import { asyncFilter } from '../helpers/asyncFilter';

const router = express.Router();

//gets all of the current user's chats
router.get("/", ensureLoggedIn, async function (req, res, next) {
  const userId = res.locals.user.id;
  const user = await prisma.user.findUniqueOrThrow({
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
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  const userId = res.locals.user.id;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    include: {
      chats: true,
    }
  });

  const chat = await prisma.chat.findFirst({
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

  return res.json
});

//create chat
router.post("/:id", ensureCorrectUser, async function (req, res, next) {
  const userId = res.locals.user.id;
  const chat = await prisma.chat.create({
    data: {
      userOneId: userId,
      userTwoId: Number(req.params.id)
    }
  })
  return res.json({chat: chat})
})

export { router as chatRoutes };