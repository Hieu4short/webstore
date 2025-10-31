import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    isLoading: false,
    error: null,
    isChatOpen: false
};

// Async thunk để gửi message
export const sendChatMessage = createAsyncThunk(
    'chatbot/sendMessage',
    async ({ message, sessionId = 'default-session' }, { rejectWithValue }) => {
        try {
            console.log('📤 Sending message to backend:', message);
            
            const response = await fetch('http://localhost:5050/api/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, sessionId })
            });
            
            console.log('📥 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Backend response with payload:', data);
            return data;
            
        } catch (error) {
            console.error('❌ API call failed:', error);
            return rejectWithValue(error.message);
        }
    }
);

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        toggleChat: (state) => {
            state.isChatOpen = !state.isChatOpen;
        },
        clearChat: (state) => {
            state.messages = [];
            state.error = null;
        },
        resetChatbot: (state) => {
            state.messages = [];
            state.error = null;
            state.isChatOpen = false;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendChatMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                
                if (action.payload.success) {
                    // QUAN TRỌNG: Ưu tiên richPayload, sau đó đến payload
                    const payload = action.payload.richPayload || action.payload.payload;
                    
                    console.log('💾 Saving message with payload:', payload);
                    
                    state.messages.push({
                        type: 'bot',
                        text: action.payload.response,
                        timestamp: new Date().toISOString(),
                        intent: action.payload.intent,
                        payload: payload // Lưu payload vào message
                    });
                } else {
                    state.messages.push({
                        type: 'bot',
                        text: action.payload.response || action.payload.message || 'Sorry, there was an error.',
                        timestamp: new Date().toISOString(),
                        isError: true
                    });
                }
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.messages.push({
                    type: 'bot',
                    text: 'Sorry, an error occurred. Please try again.',
                    timestamp: new Date().toISOString(),
                    isError: true
                });
            });
    }
});

export const { addMessage, toggleChat, clearChat, resetChatbot } = chatbotSlice.actions;
export default chatbotSlice.reducer;