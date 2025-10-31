import express from "express";
import {
  startConversation,
  sendMessage,
  getMessages,
  getUserConversations
} from "../controllers/chatController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/start", authenticate, startConversation);
router.post("/message", authenticate, sendMessage);
router.get("/:conversationId/messages", authenticate, getMessages);
router.get("/user/:userId", authenticate, getUserConversations);

export default router;