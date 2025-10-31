import { apiSlice } from "./apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation({
      query: (data) => ({
        url: '/api/chat/start',
        method: 'POST',
        body: data,
      }),
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/api/chat/message',
        method: 'POST',
        body: data,
      }),
    }),
    getMessages: builder.query({
      query: (conversationId) => `/api/chat/${conversationId}/messages`,
      providesTags: ['Message'],
    }),
    getUserConversations: builder.query({
      query: (userId) => `/api/chat/user/${userId}`,
      providesTags: ['Conversation'],
    }),
  }),
});

export const {
  useStartConversationMutation,
  useSendMessageMutation,
  useGetMessagesQuery,
  useGetUserConversationsQuery,
} = chatApiSlice;