import { createSlice } from "@reduxjs/toolkit";
// import reducer from "../auth/authSlice"; // This import seems unnecessary for favoriteSlice

const favoriteSlice = createSlice({
    name: "favorites",
    initialState: [],
    reducers: {
        addToFavorites: (state, action) => {
            //Check if the products is not already favorite
            if (!state.some((product) => product._id === action.payload._id)) {
                state.push(action.payload)
            }
        },
        removeFromFavorites: (state, action) => {
            // Remove the product with the matching ID
            return state.filter((product) => product._id !== action.payload._id);
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