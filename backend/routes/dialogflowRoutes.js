import express from 'express';
const router = express.Router();
import { detectIntent, handleWebhook } from '../services/dialogflowService.js';

// Route cho frontend chat widget
router.post('/message', async (req, res) => {
    try {
        const { message, sessionId = 'default-session' } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message cannot be blank'
            });
        }

        console.log('💬 Frontend message received:', message);
        
        const dialogflowResponse = await detectIntent(sessionId, message.trim());

        res.json({
            success: true,
            response: dialogflowResponse.response || 'No response from Dialogflow',
            intent: dialogflowResponse.intent,
            parameters: dialogflowResponse.parameters
        });
        
    } catch (error) {
        console.error('❌ DialogFlow Route Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing message'
        });
    }
});

// Route cho Dialogflow fulfillment webhook
router.post('/webhook', express.json(), handleWebhook);

export default router;