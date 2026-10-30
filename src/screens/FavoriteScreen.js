
import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";

export default function FavoriteScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const favoriteRecipes = useSelector(
    (state) => state.favorites.favoriterecipes || []
  );

  const getTitle = (item) =>
    item.recipeName || item.strMeal || item.title || "Untitled Recipe";

  const getImage = (item) =>
    item.recipeImage || item.strMealThumb || item.image;

  const getCategory = (item) =>
    item.category || item.recipeCategory || "Recipe";

  const renderRecipe = ({ item }) => {
    const title = getTitle(item);
    const image = getImage(item);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("RecipeDetail", item)}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.recipeImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.recipeImage, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}

          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.recipeCategory}>
              {getCategory(item)}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => dispatch(toggleFavorite(item))}
          accessibilityLabel={`Remove ${title} from favorites`}
        >
          <Text style={styles.removeButtonText}>♥ Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Favorites</Text>

        <View style={styles.headerSpacer} />
      </View>

      {favoriteRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♡</Text>

          <Text style={styles.emptyTitle}>No favorites yet</Text>

          <Text style={styles.emptyDescription}>
            Save your favorite recipes by tapping the heart on a recipe.
          </Text>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.exploreButtonText}>
              Explore Recipes
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item, index) =>
            String(
              item.idFood ??
              item.recipeId ??
              item.id ??
              item.strMeal ??
              index
            )
          }
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recipeList}
          columnWrapperStyle={styles.row}
        />
      )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },

  backButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: "center",
  },

  backText: {
    fontSize: hp(4),
    color: "#F59E0B",
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: "700",
    color: "#27272A",
  },

  headerSpacer: {
    width: wp(10),
  },

  recipeList: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    width: wp(44),
    marginBottom: hp(2),
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  recipeImage: {
    width: "100%",
    height: hp(17),
    backgroundColor: "#F3F4F6",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#71717A",
    fontSize: hp(1.5),
  },

  recipeInfo: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
  },

  recipeTitle: {
    fontSize: hp(1.8),
    fontWeight: "700",
    color: "#27272A",
  },

  recipeCategory: {
    marginTop: hp(0.5),
    fontSize: hp(1.5),
    color: "#A1A1AA",
  },

  removeButton: {
    backgroundColor: "#FFF7ED",
    paddingVertical: hp(1),
    alignItems: "center",
  },

  removeButtonText: {
    color: "#F59E0B",
    fontSize: hp(1.5),
    fontWeight: "700",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(8),
    paddingBottom: hp(8),
  },

  emptyIcon: {
    fontSize: hp(8),
    color: "#F59E0B",
  },

  emptyTitle: {
    marginTop: hp(2),
    fontSize: hp(2.6),
    fontWeight: "700",
    color: "#27272A",
  },

  emptyDescription: {
    marginTop: hp(1),
    fontSize: hp(1.7),
    lineHeight: hp(2.5),
    textAlign: "center",
    color: "#71717A",
  },

  exploreButton: {
    marginTop: hp(3),
    backgroundColor: "#F59E0B",
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.6),
    borderRadius: 25,
  },

  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: hp(1.8),
    fontWeight: "700",
  },
});
