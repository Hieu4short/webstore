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

// Tạo middleware để tự động reset chatbot khi logout
const chatbotResetMiddleware = (store) => (next) => (action) => {
  // Nếu action là logout, reset chatbot state trước
  if (action.type === 'auth/logout') {
    const currentState = store.getState();
    
    // Dispatch reset chatbot action trước
    store.dispatch({
      type: 'chatbot/resetChatbot' // Sẽ tạo action này trong bước tiếp theo
    });
    
    console.log('🔄 Auto-resetting chatbot on logout');
  }
  
  return next(action);
};

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

    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(chatbotResetMiddleware), // THÊM MIDDLEWARE VÀO ĐÂY
    devTools: true,
});

setupListeners(store.dispatch);

export default store;