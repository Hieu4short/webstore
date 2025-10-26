import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    isLoading: false,
    error: null,
    isChatOpen: false
};

// Async thunk để gửi message - DÙNG FETCH TRỰC TIẾP
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
            console.log('✅ Backend response:', data);
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
                    state.messages.push({
                        type: 'bot',
                        text: action.payload.response,
                        timestamp: new Date().toISOString(),
                        intent: action.payload.intent
                    });
                } else {
                    state.messages.push({
                        type: 'bot',
                        text: action.payload.response || 'Sorry, there was an error.',
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

export const { addMessage, toggleChat, clearChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;