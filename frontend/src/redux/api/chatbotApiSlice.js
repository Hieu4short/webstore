import { apiSlice } from './apiSlice';

export const chatbotApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (data) => ({
                url: '/chatbot/message',
                method: 'POST',
                body: data
            })
        })
    })
});

export const { useSendMessageMutation } = chatbotApi;