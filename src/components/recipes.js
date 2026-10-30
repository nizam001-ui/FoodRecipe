
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

export default function Recipe({ categories, foods = [] }) {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => {
    const recipeName =
      item.recipeName || item.strMeal || item.title || "Untitled Recipe";

    const recipeImage =
      item.recipeImage || item.strMealThumb || item.image;

    const recipeCategory =
      item.category || item.recipeCategory || item.strCategory || "Recipe";

    return (
      <TouchableOpacity
        testID="articleDisplay"
        style={[
          styles.cardContainer,
          index % 2 === 0 ? styles.leftCard : styles.rightCard,
        ]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("RecipeDetail", item)}
      >
        {recipeImage ? (
          <Image
            source={{ uri: recipeImage }}
            style={styles.articleImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}

        <Text style={styles.articleText} numberOfLines={2}>
          {recipeName}
        </Text>

        <Text style={styles.articleDescription} numberOfLines={1}>
          {recipeCategory}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} testID="recipesDisplay">
      <FlatList
        data={foods}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          String(item.idFood ?? item.recipeId ?? item.id ?? index)
        }
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recipes found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  cardContainer: {
    flex: 1,
    marginBottom: hp(2),
  },
  leftCard: {
    marginRight: wp(2),
  },
  rightCard: {
    marginLeft: wp(2),
  },
  row: {
    justifyContent: "space-between",
  },
  articleImage: {
    width: "100%",
    height: hp(18),
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  imagePlaceholder: {
    width: "100%",
    height: hp(18),
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: hp(1.5),
  },
  articleText: {
    fontSize: hp(1.7),
    fontWeight: "600",
    color: "#27272A",
    marginTop: hp(1),
    marginHorizontal: wp(1),
  },
  articleDescription: {
    fontSize: hp(1.4),
    color: "#6B7280",
    marginTop: hp(0.5),
    marginHorizontal: wp(1),
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: hp(3),
  },
});
