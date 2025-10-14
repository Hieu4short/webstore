import { createSlice } from '@reduxjs/toolkit';

const comparisonSlice = createSlice({
    name: 'comparison',
    initialState: {
        comparisonItems: JSON.parse(localStorage.getItem('comparisonItems')) || [],
    },
    reducers: {
        addToComparison: (state, action) => {
            const product = action.payload;
            const existingItem = state.comparisonItems.find(item => item._id === product._id);
            const maxCompareItems = 4;

            if (!existingItem) {
                if (state.comparisonItems.length >= maxCompareItems) {
                    // Remove the first item if maximum reached
                    state.comparisonItems.shift();
                }
                state.comparisonItems.push(product);
            }
            localStorage.setItem('comparisonItems', JSON.stringify(state.comparisonItems));
        },
        removeFromComparison: (state, action) => {
            state.comparisonItems = state.comparisonItems.filter(item => item._id !== action.payload);
            localStorage.setItem('comparisonItems', JSON.stringify(state.comparisonItems));
        },
        clearComparison: (state) => {
            state.comparisonItems = [];
            localStorage.setItem('comparisonItems', JSON.stringify(state.comparisonItems));
        },
    },
});

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions;
export default comparisonSlice.reducer;