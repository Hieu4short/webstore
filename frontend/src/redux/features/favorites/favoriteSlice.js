import { createSlice } from "@reduxjs/toolkit";
import { addFavoriteToLocalStorage, removeFavoriteFromLocalStorage } from "../../../Utils/localStorage";

// import reducer from "../auth/authSlice"; // This import seems unnecessary for favoriteSlice

const favoriteSlice = createSlice({
    name: "favorites",
    initialState: [],
    reducers: {
        addToFavorites: (state, action) => {
            //Check if the products is not already favorite
            if (!state.some((product) => product._id === action.payload._id)) {
                state.push(action.payload)
                addFavoriteToLocalStorage(action.payload);
            }
        },
        removeFromFavorites: (state, action) => {
            // Remove the product with the matching ID
            const updateFavorites = state.filter((product) => product._id !== action.payload._id);
            removeFavoriteFromLocalStorage(action.payload._id);
            return updateFavorites;
        },
        setFavorites: (state, action) => {
            //Set the favorites from local storage
            return action.payload;
        }
    }
});

export const {addToFavorites, removeFromFavorites, setFavorites} = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;