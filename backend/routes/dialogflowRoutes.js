import express from 'express';
const router = express.Router();
import dialogflowService from '../services/dialogflowService.js'; 

router.post('/message', async (req, res) => {
    try {
        const { message, sessionId = 'default-session' } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Tin nhắn không được để trống'
            });
        }

        const dialogflowResponse = await dialogflowService.detectIntent(
            sessionId, 
            message.trim()
        );

        res.json(dialogflowResponse);
    } catch (error) {
        console.error('DialogFlow Route Error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xử lý tin nhắn'
        });
    }
});

export default router; 