
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { toggleFavorite } from "../redux/favoritesSlice";

export default function RecipeDetailScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Recipe is passed from HomeScreen when a card is selected.
  const recipe = route.params || {};

  const favorites = useSelector(
    (state) => state.favorites.favoriterecipes || []
  );

  const recipeId = recipe.idFood || recipe.recipeId || recipe.id;

  const isFavorite = favorites.some(
    (item) =>
      String(item.idFood || item.recipeId || item.id) === String(recipeId)
  );

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];

  const instructions =
    recipe.recipeInstructions ||
    recipe.instructions ||
    recipe.cookingDescription ||
    recipe.description ||
    "No cooking instructions available.";

  const recipeName =
    recipe.recipeName || recipe.title || recipe.strMeal || "Untitled Recipe";

  const recipeImage =
    recipe.recipeImage || recipe.image || recipe.strMealThumb;

  const handleFavorite = () => {
    dispatch(toggleFavorite(recipe));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFavorite}
            style={styles.favoriteButton}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Image */}
        {recipeImage ? (
          <Image
            source={{ uri: recipeImage }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.recipeImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderIcon}>🍽️</Text>
          </View>
        )}

        {/* Recipe Information */}
        <View style={styles.content}>
          <Text style={styles.recipeTitle}>{recipeName}</Text>

          <Text style={styles.category}>
            {recipe.category || recipe.recipeCategory || "Delicious Recipe"}
          </Text>

          {/* Recipe Details */}
          <View style={styles.infoContainer}>
            {recipe.prepTime ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <Text style={styles.infoLabel}>Preparation</Text>
                <Text style={styles.infoValue}>{recipe.prepTime}</Text>
              </View>
            ) : null}

            {recipe.servings ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🍽️</Text>
                <Text style={styles.infoLabel}>Servings</Text>
                <Text style={styles.infoValue}>{recipe.servings}</Text>
              </View>
            ) : null}

            {recipe.difficulty ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⭐</Text>
                <Text style={styles.infoLabel}>Difficulty</Text>
                <Text style={styles.infoValue}>{recipe.difficulty}</Text>
              </View>
            ) : null}
          </View>

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Ingredients</Text>

          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => {
              const name =
                typeof ingredient === "string"
                  ? ingredient
                  : ingredient.ingredientName ||
                    ingredient.name ||
                    ingredient.strIngredient ||
                    "Ingredient";

              const measure =
                typeof ingredient === "string"
                  ? ""
                  : ingredient.measure || ingredient.strMeasure || "";

              return (
                <View key={index} style={styles.ingredientRow}>
                  <Text style={styles.ingredientName}>• {name}</Text>
                  <Text style={styles.ingredientMeasure}>{measure}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>
              No ingredients available.
            </Text>
          )}

          {/* Instructions */}
          <Text style={styles.sectionTitle}>Cooking Instructions</Text>

          <Text style={styles.instructions}>{instructions}</Text>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
    paddingBottom: hp(2),
  },

  backButton: {
    paddingVertical: hp(0.5),
  },

  backText: {
    fontSize: hp(2.2),
    color: "#F59E0B",
    fontWeight: "600",
  },

  favoriteButton: {
    width: wp(11),
    height: wp(11),
    borderRadius: 30,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteIcon: {
    fontSize: hp(3),
    color: "#F59E0B",
  },

  recipeImage: {
    width: wp(90),
    height: hp(30),
    alignSelf: "center",
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },

  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderIcon: {
    fontSize: hp(7),
  },

  content: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
  },

  recipeTitle: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#27272A",
  },

  category: {
    fontSize: hp(1.8),
    color: "#F59E0B",
    marginTop: hp(0.7),
    fontWeight: "600",
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    paddingVertical: hp(2),
    marginTop: hp(2.5),
    gap: wp(3),
  },

  infoItem: {
    alignItems: "center",
    minWidth: wp(22),
  },

  infoIcon: {
    fontSize: hp(2.5),
  },

  infoLabel: {
    fontSize: hp(1.4),
    color: "#71717A",
    marginTop: hp(0.5),
  },

  infoValue: {
    fontSize: hp(1.7),
    fontWeight: "700",
    color: "#27272A",
    marginTop: hp(0.3),
  },

  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: "700",
    color: "#27272A",
    marginTop: hp(3),
    marginBottom: hp(1.5),
  },

  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  ingredientName: {
    fontSize: hp(1.8),
    color: "#3F3F46",
    flex: 1,
  },

  ingredientMeasure: {
    fontSize: hp(1.7),
    color: "#71717A",
    marginLeft: wp(3),
  },

  instructions: {
    fontSize: hp(1.8),
    lineHeight: hp(3),
    color: "#52525B",
    textAlign: "justify",
  },

  emptyText: {
    fontSize: hp(1.7),
    color: "#71717A",
  },

  bottomSpace: {
    height: hp(4),
  },
});
