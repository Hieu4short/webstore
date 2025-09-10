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
        // You can add more endpoints here
    }),
});


export const { useLoginMutation } = userApiSlice;