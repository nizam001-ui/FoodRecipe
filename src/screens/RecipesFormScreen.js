
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const STORAGE_KEY = "customrecipes";

export default function RecipesFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const existingRecipe = route.params?.recipe || null;
  const isEditing = Boolean(existingRecipe);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [saving, setSaving] = useState(false);

  // Display messages consistently on web and mobile.
  const showMessage = (message, callback) => {
    if (Platform.OS === "web") {
      globalThis.alert(message);
      if (callback) callback();
    } else {
      Alert.alert("Foodie", message, [
        {
          text: "OK",
          onPress: callback,
        },
      ]);
    }
  };

  // Load existing recipe information into the form.
  useEffect(() => {
    if (!existingRecipe) return;

    setTitle(existingRecipe.title || "");
    setImage(existingRecipe.image || "");
    setDescription(existingRecipe.description || "");

    const savedIngredients = existingRecipe.ingredients || [];

    setIngredients(
      Array.isArray(savedIngredients)
        ? savedIngredients
            .map((item) => {
              if (typeof item === "string") return item;

              const name =
                item.ingredientName || item.name || "";

              const measure = item.measure || "";

              return measure ? `${name} - ${measure}` : name;
            })
            .filter(Boolean)
            .join("\n")
        : String(savedIngredients)
    );

    setInstructions(
      existingRecipe.instructions ||
      existingRecipe.recipeInstructions ||
      ""
    );

    setPrepTime(String(existingRecipe.prepTime || ""));
    setServings(String(existingRecipe.servings || ""));
    setDifficulty(existingRecipe.difficulty || "Easy");
  }, [existingRecipe]);

  // Save a new recipe or update an existing recipe.
  const handleSaveRecipe = async () => {
    if (saving) return;

    if (!title.trim()) {
      showMessage("Please enter a recipe name.");
      return;
    }

    if (!instructions.trim()) {
      showMessage("Please enter the cooking instructions.");
      return;
    }

    setSaving(true);

    try {
      // Read existing recipes.
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);

      const savedRecipes = storedData
        ? JSON.parse(storedData)
        : [];

      if (!Array.isArray(savedRecipes)) {
        throw new Error("The saved recipe data is invalid.");
      }

      // Create the recipe object.
      const now = new Date().toISOString();

      const recipeData = {
        ...(existingRecipe || {}),

        id: existingRecipe?.id ?? `recipe-${Date.now()}`,

        title: title.trim(),
        image: image.trim(),
        description: description.trim(),

        ingredients: ingredients
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        instructions: instructions.trim(),
        prepTime: prepTime.trim(),
        servings: servings.trim(),
        difficulty,

        createdAt: existingRecipe?.createdAt || now,
        updatedAt: now,
      };

      let updatedRecipes;

      if (isEditing) {
        // Find the original recipe.
        const passedIndex = route.params?.index;

        let recipeIndex = -1;

        // First use the original index if it still matches.
        if (
          Number.isInteger(passedIndex) &&
          passedIndex >= 0 &&
          passedIndex < savedRecipes.length
        ) {
          const indexedRecipe = savedRecipes[passedIndex];

          if (
            existingRecipe.id == null ||
            indexedRecipe.id == null ||
            String(indexedRecipe.id) === String(existingRecipe.id)
          ) {
            recipeIndex = passedIndex;
          }
        }

        // Otherwise search by recipe ID.
        if (recipeIndex === -1 && existingRecipe.id != null) {
          recipeIndex = savedRecipes.findIndex(
            (item) =>
              item.id != null &&
              String(item.id) === String(existingRecipe.id)
          );
        }

        if (recipeIndex === -1) {
          throw new Error(
            "Recipe not found. Please return to My Food and try again."
          );
        }

        // Replace the existing recipe.
        updatedRecipes = [...savedRecipes];

        updatedRecipes[recipeIndex] = {
          ...savedRecipes[recipeIndex],
          ...recipeData,
        };
      } else {
        // Add a new recipe.
        updatedRecipes = [...savedRecipes, recipeData];
      }

      // Save the complete recipe list.
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRecipes)
      );

      // Verify that the saved data can be read back.
      const verification = await AsyncStorage.getItem(STORAGE_KEY);

      const verifiedRecipes = verification
        ? JSON.parse(verification)
        : [];

      if (!Array.isArray(verifiedRecipes)) {
        throw new Error("Could not verify saved recipes.");
      }

      const savedSuccessfully = verifiedRecipes.some(
        (item) => String(item.id) === String(recipeData.id)
      );

      if (!savedSuccessfully) {
        throw new Error("Recipe could not be saved.");
      }

      // Return to My Food after saving.
      showMessage(
        isEditing
          ? "Recipe updated successfully!"
          : "Recipe added successfully!",
        () => {
          navigation.goBack();
        }
      );
    } catch (error) {
      console.error("Recipe save error:", error);

      showMessage(
        error.message || "Unable to save your recipe. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Reusable input component.
  const renderInput = (
    label,
    value,
    onChangeText,
    placeholder,
    options = {}
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          options.multiline && styles.multilineInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={options.multiline || false}
        numberOfLines={options.numberOfLines || 1}
        keyboardType={options.keyboardType || "default"}
        autoCapitalize={
          options.autoCapitalize || "sentences"
        }
        editable={!saving}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          disabled={saving}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Heading */}
        <Text style={styles.heading}>
          {isEditing ? "Edit Recipe" : "Create Your Recipe"}
        </Text>

        <Text style={styles.subtitle}>
          {isEditing
            ? "Update your recipe details below."
            : "Share your favorite meal with your personal cookbook."}
        </Text>

        {/* Recipe Name */}
        {renderInput(
          "Recipe Name *",
          title,
          setTitle,
          "e.g. Homemade Chicken Biryani"
        )}

        {/* Image URL */}
        {renderInput(
          "Image URL",
          image,
          setImage,
          "https://example.com/recipe.jpg",
          { autoCapitalize: "none" }
        )}

        {/* Description */}
        {renderInput(
          "Short Description",
          description,
          setDescription,
          "Describe your recipe...",
          { multiline: true, numberOfLines: 3 }
        )}

        {/* Ingredients */}
        {renderInput(
          "Ingredients",
          ingredients,
          setIngredients,
          "Enter one ingredient per line\nExample: 2 cups rice\n500g chicken\n1 tsp salt",
          { multiline: true, numberOfLines: 6 }
        )}

        {/* Instructions */}
        {renderInput(
          "Cooking Instructions *",
          instructions,
          setInstructions,
          "Describe the cooking steps...",
          { multiline: true, numberOfLines: 7 }
        )}

        {/* Preparation Time and Servings */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            {renderInput(
              "Prep Time",
              prepTime,
              setPrepTime,
              "e.g. 30 minutes"
            )}
          </View>

          <View style={styles.halfField}>
            {renderInput(
              "Servings",
              servings,
              setServings,
              "e.g. 4"
            )}
          </View>
        </View>

        {/* Difficulty */}
        <Text style={styles.label}>Difficulty</Text>

        <View style={styles.difficultyRow}>
          {["Easy", "Medium", "Hard"].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setDifficulty(level)}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.selectedDifficulty,
              ]}
              disabled={saving}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === level &&
                    styles.selectedDifficultyText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save / Update */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSaveRecipe}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving
              ? "Saving..."
              : isEditing
              ? "Update Recipe"
              : "Save Recipe"}
          </Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    padding: wp(5),
    paddingBottom: hp(5),
  },

  backButton: {
    marginBottom: hp(2),
    alignSelf: "flex-start",
  },

  backText: {
    color: "#F59E0B",
    fontSize: hp(2),
    fontWeight: "600",
  },

  heading: {
    fontSize: hp(3.2),
    fontWeight: "700",
    color: "#111827",
    marginBottom: hp(0.7),
  },

  subtitle: {
    fontSize: hp(1.8),
    color: "#6B7280",
    marginBottom: hp(3),
  },

  field: {
    marginBottom: hp(2),
  },

  label: {
    fontSize: hp(1.8),
    fontWeight: "600",
    color: "#374151",
    marginBottom: hp(0.8),
  },

  input: {
    minHeight: hp(6),
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.3),
    fontSize: hp(1.8),
    color: "#111827",
  },

  multilineInput: {
    minHeight: hp(12),
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    gap: wp(3),
  },

  halfField: {
    flex: 1,
  },

  difficultyRow: {
    flexDirection: "row",
    gap: wp(2),
    marginTop: hp(0.5),
    marginBottom: hp(3),
  },

  difficultyButton: {
    flex: 1,
    paddingVertical: hp(1.3),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  selectedDifficulty: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },

  difficultyText: {
    fontSize: hp(1.7),
    color: "#374151",
    fontWeight: "500",
  },

  selectedDifficultyText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: hp(1.7),
    borderRadius: 10,
    alignItems: "center",
    marginTop: hp(1),
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: hp(2),
    fontWeight: "700",
  },

  cancelButton: {
    paddingVertical: hp(1.5),
    alignItems: "center",
  },

  cancelText: {
    color: "#6B7280",
    fontSize: hp(1.8),
    fontWeight: "600",
  },
});
