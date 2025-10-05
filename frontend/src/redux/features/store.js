import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from "./auth/authSlice";
import favoritesReducer from "./favorites/FavoriteSlice";
import { getFavoritesFromLocalStorage } from "../../Utils/localStorage";
// import FavoriteSlice from "./favorites/FavoriteSlice"; // Removed redundant/incorrect import

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        favorites: favoritesReducer,
    },

    preloadedState: {
        favorites: initialFavorites,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

setupListeners(store.dispatch);

export default store;
