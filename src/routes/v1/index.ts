import { Router } from 'express';

import { userRoutes } from "./users.route";
import { authRoutes } from "./auth.route";
import { friendRoutes } from "./friends.route";
import { likeDislikeRoutes } from "./likedislike.route";
import { messageRoutes } from "./messages.route";
import { chatRoutes } from "./chats.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/likeDislike", likeDislikeRoutes);
router.use("/friends", friendRoutes);
router.use("/chats", chatRoutes);
router.use("/messages", messageRoutes);

export default router;