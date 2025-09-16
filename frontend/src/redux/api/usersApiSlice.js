import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../features/constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
            // Invalidates the 'User' tag on successful login
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
    }),
});


export const { useLoginMutation, useLogoutMutation } = userApiSlice;