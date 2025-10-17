import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from "./auth/authSlice";
import favoritesReducer from "./favorites/FavoriteSlice";
import cartReducer from "./cart/cartSlice";
import shopReducer from "./shop/shopSlice"; 
import { getFavoritesFromLocalStorage } from "../../Utils/localStorage";
import comparisonReducers from "./comparison/comparisonSlice";
import chatbotReducer from './chatbot/chatbotSlice';


const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        favorites: favoritesReducer,
        comparison: comparisonReducers, 
        cart: cartReducer,
        shop: shopReducer, 
        chatbot: chatbotReducer,
    },

    preloadedState: {
        favorites: initialFavorites,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

setupListeners(store.dispatch);

export default store;
