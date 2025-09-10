import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../features/constants";

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product', 'Order', 'User', 'Category'],
    endpoints: (builder) => ({}), // Add an empty endpoints field
})