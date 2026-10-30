
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const recipe = action.payload;

      const recipeId =
        recipe.idFood ??
        recipe.recipeId ??
        recipe.id ??
        recipe.strMeal;

      const existingIndex = state.favoriterecipes.findIndex((item) => {
        const existingId =
          item.idFood ??
          item.recipeId ??
          item.id ??
          item.strMeal;

        return String(existingId) === String(recipeId);
      });

      if (existingIndex !== -1) {
        state.favoriterecipes.splice(existingIndex, 1);
      } else {
        state.favoriterecipes.push(recipe);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
