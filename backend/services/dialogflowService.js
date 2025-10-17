import dialogflow from '@google-cloud/dialogflow';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DialogFlowService {
    constructor() {
        console.log('🔧 Initializing DialogFlow Service...');
        
        // Dùng giá trị từ .env hoặc fallback
        this.projectId = process.env.DIALOGFLOW_PROJECT_ID || 'webstore-475312';
        
        // FIX: Dùng path tương đối từ file hiện tại
        const credentialsPath = path.join(
            __dirname, 
            '../config/google-credentials/webstore-475312-5398855b0616.json'
        );
        
        console.log('✅ Project ID:', this.projectId);
        console.log('🔑 Credentials Path:', credentialsPath);
        console.log('📁 File exists:', fs.existsSync(credentialsPath));
        
        if (!fs.existsSync(credentialsPath)) {
            throw new Error(`Credentials file not found: ${credentialsPath}`);
        }
        
        try {
            this.config = { keyFilename: credentialsPath };
            this.sessionClient = new dialogflow.SessionsClient(this.config);
            console.log('✅ DialogFlow client initialized successfully');
        } catch (error) {
            console.error('❌ DialogFlow client error:', error.message);
            throw error;
        }
    }

    async detectIntent(sessionId, message, languageCode = 'en') {
        console.log(`🤖 detectIntent: "${message}"`);
        
        try {
            const sessionPath = this.sessionClient.projectAgentSessionPath(
                this.projectId, 
                sessionId
            );

            const request = {
                session: sessionPath,
                queryInput: {
                    text: { text: message, languageCode: languageCode },
                },
            };

            console.log('📤 Sending to DialogFlow...');
            const responses = await this.sessionClient.detectIntent(request);
            const result = responses[0].queryResult;
            
            console.log('✅ Response:', result.fulfillmentText);
            
            return {
                success: true,
                intent: result.intent.displayName,
                confidence: result.intentDetectionConfidence,
                response: result.fulfillmentText,
                parameters: result.parameters.fields,
                hasOrderInfo: this.checkForOrderIntent(result)
            };
            
        } catch (error) {
            console.error('❌ DialogFlow API error:', error.message);
            return {
                success: false,
                error: error.message,
                response: 'Sorry, I am having technical issues. Please try again later.'
            };
        }
    }

    checkForOrderIntent(result) {
        const orderIntents = ['track.order', 'check.order.status', 'order.inquiry'];
        return orderIntents.includes(result.intent.displayName);
    }
}

export default new DialogFlowService();