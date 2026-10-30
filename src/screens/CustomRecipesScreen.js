
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function CustomRecipesScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const recipe = route.params?.recipe;

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Recipe not found</Text>
          <Text style={styles.description}>
            Please return to My Food and select a recipe.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const title =
    recipe.title || recipe.recipeName || "Untitled Recipe";

  const imageUri = recipe.image || recipe.recipeImage;

  const description =
    recipe.description ||
    recipe.cookingDescription ||
    "No description available.";

  const instructions =
    recipe.instructions ||
    recipe.recipeInstructions ||
    "";

  const rawIngredients = recipe.ingredients || [];

  const ingredients = Array.isArray(rawIngredients)
    ? rawIngredients
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          const name =
            item.ingredientName || item.name || "";

          const measure = item.measure || "";

          return [measure, name].filter(Boolean).join(" ");
        })
        .filter(Boolean)
    : String(rawIngredients)
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

    const handleEdit = () => {
      navigation.navigate("RecipesFormScreen", {
        recipe,
        index: route.params?.index,
        isEditing: true,
      });
    };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back to My Food</Text>
        </TouchableOpacity>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>🍲</Text>
            <Text style={styles.placeholderText}>
              No recipe image provided
            </Text>
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.infoRow}>
            {!!recipe.prepTime && (
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>PREPARATION</Text>
                <Text style={styles.infoValue}>
                  {recipe.prepTime}
                </Text>
              </View>
            )}

            {!!recipe.servings && (
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>SERVINGS</Text>
                <Text style={styles.infoValue}>
                  {recipe.servings}
                </Text>
              </View>
            )}

            {!!recipe.difficulty && (
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>DIFFICULTY</Text>
                <Text style={styles.infoValue}>
                  {recipe.difficulty}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Ingredients
            </Text>

            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <View
                  key={`${index}-${ingredient}`}
                  style={styles.ingredientRow}
                >
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.ingredientText}>
                    {ingredient}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.mutedText}>
                No ingredients have been added.
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Cooking Instructions
            </Text>

            {instructions.trim() ? (
              <Text style={styles.instructionsText}>
                {instructions}
              </Text>
            ) : (
              <Text style={styles.mutedText}>
                No cooking instructions have been added.
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
          >
            <Text style={styles.editButtonText}>
              Edit This Recipe
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  backButton: {
    alignSelf: "flex-start",
    marginHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  backText: {
    fontSize: hp(1.9),
    color: "#F59E0B",
    fontWeight: "600",
  },
  recipeImage: {
    width: "100%",
    height: hp(32),
    backgroundColor: "#E5E7EB",
  },
  imagePlaceholder: {
    width: "100%",
    height: hp(25),
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: hp(6),
    marginBottom: hp(1),
  },
  placeholderText: {
    fontSize: hp(1.8),
    color: "#6B7280",
  },
  detailsContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
  },
  title: {
    fontSize: hp(3.2),
    fontWeight: "700",
    color: "#111827",
    marginBottom: hp(1),
  },
  description: {
    fontSize: hp(1.9),
    lineHeight: hp(2.8),
    color: "#6B7280",
    marginBottom: hp(2),
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
    marginBottom: hp(2),
  },
  infoCard: {
    flexGrow: 1,
    flexBasis: "28%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: wp(3),
  },
  infoLabel: {
    fontSize: hp(1.15),
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: hp(0.6),
  },
  infoValue: {
    fontSize: hp(1.8),
    color: "#111827",
    fontWeight: "700",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: wp(4),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: "700",
    color: "#111827",
    marginBottom: hp(1.5),
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(1),
  },
  bullet: {
    fontSize: hp(2.2),
    color: "#F59E0B",
    marginRight: wp(2),
  },
  ingredientText: {
    flex: 1,
    fontSize: hp(1.8),
    lineHeight: hp(2.6),
    color: "#374151",
  },
  instructionsText: {
    fontSize: hp(1.8),
    lineHeight: hp(3),
    color: "#374151",
  },
  mutedText: {
    fontSize: hp(1.7),
    lineHeight: hp(2.5),
    color: "#9CA3AF",
  },
  editButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: hp(1.7),
    borderRadius: 10,
    alignItems: "center",
    marginTop: hp(1),
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: hp(2),
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp(6),
  },
  emptyTitle: {
    fontSize: hp(2.8),
    color: "#111827",
    fontWeight: "700",
    marginBottom: hp(1),
  },
});