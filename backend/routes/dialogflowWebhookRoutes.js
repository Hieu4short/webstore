import express from 'express';
import { handleWebhook } from '../services/dialogflowService.js';

const router = express.Router();

// Route for Dialogflow fulfillment webhook
router.post('/webhook', express.json(), handleWebhook);

export default router;