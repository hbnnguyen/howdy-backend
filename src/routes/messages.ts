import 'express-async-errors';

import express from 'express';
import { prisma } from '../app';
import { ensureCorrectUser, ensureLoggedIn } from '../middleware/auth';
import { NotFoundError } from '../expressError';
import { userToUserOutput } from '../user';
import { asyncFilter } from '../helpers/asyncFilter';

const router = express.Router();

//get messages from chat id
router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  const chat = await prisma.chat.findUnique({
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
router.post("/:id", ensureCorrectUser, async function (req, res, next) {
  const userId = res.locals.user.id;

  const message = await prisma.message.create({
    data: {
      authorId: userId,
      chatId: Number(req.params.id),
      contents: req.body.messageContent
    }
  })

  return res.json({message: message})
})

export { router as messageRoutes };