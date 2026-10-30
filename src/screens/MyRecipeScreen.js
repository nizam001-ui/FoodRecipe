
import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const STORAGE_KEY = "customrecipes";

export default function MyRecipeScreen() {
  const navigation = useNavigation();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reload recipes whenever My Food becomes active.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchRecipes = async () => {
        setLoading(true);

        try {
          const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
          const parsedRecipes = savedRecipes
            ? JSON.parse(savedRecipes)
            : [];

          if (!Array.isArray(parsedRecipes)) {
            throw new Error("Invalid saved recipe data.");
          }

          if (isActive) {
            setRecipes(parsedRecipes);
          }
        } catch (error) {
          console.error("Error loading recipes:", error);

          if (isActive) {
            setRecipes([]);

            const message = "Unable to load your recipes.";

            if (Platform.OS === "web") {
              globalThis.alert(message);
            } else {
              Alert.alert("Error", message);
            }
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchRecipes();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Navigate to the recipe creation form.
  const handleAddRecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  // Open custom recipe details.
  const handleRecipeClick = (recipe, index) => {
    navigation.navigate("CustomRecipesScreen", {
      recipe,
      index,
    });
  };

  // Delete a recipe.
  const deleteRecipe = (index) => {
    const performDelete = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);

        const currentRecipes = savedRecipes
          ? JSON.parse(savedRecipes)
          : [];

        if (
          !Array.isArray(currentRecipes) ||
          index < 0 ||
          index >= currentRecipes.length
        ) {
          throw new Error("Recipe not found.");
        }

        const updatedRecipes = currentRecipes.filter(
          (_, recipeIndex) => recipeIndex !== index
        );

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedRecipes)
        );

        setRecipes(updatedRecipes);
      } catch (error) {
        console.error("Error deleting recipe:", error);

        const message = error.message || "Unable to delete this recipe.";

        if (Platform.OS === "web") {
          globalThis.alert(message);
        } else {
          Alert.alert("Error", message);
        }
      }
    };

    if (Platform.OS === "web") {
      const confirmed = globalThis.confirm(
        "Are you sure you want to delete this recipe?"
      );

      if (confirmed) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Delete Recipe",
        "Are you sure you want to delete this recipe?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: performDelete,
          },
        ]
      );
    }
  };

  // Navigate to edit recipe form.
  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipe,
      index,
      isEditing: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Food</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Add Recipe Button */}
      <TouchableOpacity
        onPress={handleAddRecipe}
        style={styles.addButton}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Add New Recipe</Text>
      </TouchableOpacity>

      {/* Loading */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#F59E0B"
          style={styles.loader}
        />
      ) : recipes.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍲</Text>

          <Text style={styles.emptyTitle}>
            No recipes added yet
          </Text>

          <Text style={styles.emptyDescription}>
            Create your own recipes and keep all your favorite meals in one place.
          </Text>
        </View>
      ) : (
        /* Recipe List */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.recipeGrid}>
            {recipes.map((recipe, index) => (
              <View
                key={String(recipe.id || recipe.title || index)}
                style={styles.recipeCard}
                testID="recipeCard"
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleRecipeClick(recipe, index)}
                  testID="handlerecipeBtn"
                >
                  {recipe.image ? (
                    <Image
                      source={{ uri: recipe.image }}
                      style={styles.recipeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.recipeImage,
                        styles.imagePlaceholder,
                      ]}
                    >
                      <Text style={styles.placeholderText}>🍽️</Text>
                    </View>
                  )}

                  <View style={styles.recipeInfo}>
                    <Text
                      style={styles.recipeTitle}
                      numberOfLines={2}
                    >
                      {recipe.title || "Untitled Recipe"}
                    </Text>

                    <Text
                      style={styles.recipeDescription}
                      numberOfLines={2}
                      testID="recipeDescp"
                    >
                      {recipe.description || "No description available"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Edit and Delete */}
                <View
                  style={styles.actionButtonsContainer}
                  testID="editDeleteButtons"
                >
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editRecipe(recipe, index)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteRecipe(index)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(4),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },

  backButton: {
    width: wp(18),
  },

  backButtonText: {
    fontSize: hp(2),
    color: "#F59E0B",
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: "700",
    color: "#27272A",
  },

  headerSpacer: {
    width: wp(18),
  },

  addButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: hp(1.5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: hp(2.5),
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: hp(2),
  },

  loader: {
    marginTop: hp(15),
  },

  scrollContainer: {
    paddingBottom: hp(4),
  },

  recipeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  recipeCard: {
    width: wp(44),
    marginBottom: hp(2),
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  recipeImage: {
    width: "100%",
    height: hp(17),
    backgroundColor: "#F3F4F6",
  },

  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    fontSize: hp(5),
  },

  recipeInfo: {
    padding: wp(3),
  },

  recipeTitle: {
    fontSize: hp(1.8),
    fontWeight: "700",
    color: "#27272A",
  },

  recipeDescription: {
    fontSize: hp(1.5),
    color: "#71717A",
    marginTop: hp(0.7),
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: wp(2),
    paddingBottom: hp(1.2),
    gap: wp(2),
  },

  editButton: {
    flex: 1,
    backgroundColor: "#F59E0B",
    paddingVertical: hp(0.9),
    borderRadius: 8,
    alignItems: "center",
  },

  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: hp(1.5),
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#FFF1F2",
    paddingVertical: hp(0.9),
    borderRadius: 8,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#E11D48",
    fontWeight: "600",
    fontSize: hp(1.5),
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
    marginTop: hp(12),
  },

  emptyIcon: {
    fontSize: hp(7),
  },

  emptyTitle: {
    fontSize: hp(2.4),
    fontWeight: "700",
    color: "#27272A",
    marginTop: hp(2),
  },

  emptyDescription: {
    fontSize: hp(1.7),
    color: "#71717A",
    textAlign: "center",
    lineHeight: hp(2.5),
    marginTop: hp(1),
  },
});
