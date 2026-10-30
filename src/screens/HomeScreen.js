
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Categories from "../components/categories";
import FoodItems from "../components/recipes";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Chicken");

  // Food categories with their original circular images
  const categories = [
    "Beef",
    "Chicken",
    "Dessert",
    "Lamb",
    "Miscellaneous",
    "Pasta",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
    "Vegan",
    "Vegetarian",
    "Breakfast",
    "Goat",
  ].map((category, index) => ({
    idCategory: String(index + 1),
    strCategory: category,
    strCategoryThumb: `https://www.themealdb.com/images/category/${category.toLowerCase()}.png`,
  }));

  // Recipe data
  const allFood = [
    {
      idFood: "1",
      recipeName: "Chicken Handi",
      category: "Chicken",
      recipeCategory: "Chicken",
      recipeImage:
        "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
      recipeInstructions:
        "Cook chicken with spices, tomatoes and creamy sauce until tender.",
      ingredients: [
        { ingredientName: "Chicken", measure: "500g" },
        { ingredientName: "Tomatoes", measure: "2" },
        { ingredientName: "Cream", measure: "1 cup" },
      ],
    },
    {
      idFood: "2",
      recipeName: "Chicken Biryani",
      category: "Chicken",
      recipeCategory: "Chicken",
      recipeImage:
        "https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg",
      recipeInstructions:
        "Prepare spiced chicken and layer it with cooked rice.",
      ingredients: [
        { ingredientName: "Chicken", measure: "500g" },
        { ingredientName: "Rice", measure: "2 cups" },
      ],
    },
    {
      idFood: "3",
      recipeName: "Beef and Mustard Pie",
      category: "Beef",
      recipeCategory: "Beef",
      recipeImage:
        "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
      recipeInstructions:
        "Cook beef with mustard sauce and bake inside pastry.",
      ingredients: [
        { ingredientName: "Beef", measure: "500g" },
        { ingredientName: "Mustard", measure: "2 tbsp" },
      ],
    },
    {
      idFood: "4",
      recipeName: "Chocolate Cake",
      category: "Dessert",
      recipeCategory: "Dessert",
      recipeImage:
        "https://www.themealdb.com/images/media/meals/qxytrx1511304021.jpg",
      recipeInstructions:
        "Mix the ingredients and bake until the cake is ready.",
      ingredients: [
        { ingredientName: "Chocolate", measure: "200g" },
        { ingredientName: "Flour", measure: "2 cups" },
      ],
    },
    
  ];

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
  };

  const filteredFoods = allFood.filter(
    (food) => food.category === activeCategory
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Food Lover!</Text>
          <Text style={styles.heading}>Find your favorite food</Text>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>

        <Categories
          categories={categories}
          activeCategory={activeCategory}
          handleChangeCategory={handleChangeCategory}
        />

        <View style={styles.recipeHeading}>
          <Text style={styles.sectionTitle}>Popular Recipes</Text>
          <Text style={styles.categoryLabel}>{activeCategory}</Text>
        </View>

        <FoodItems
          categories={categories}
          foods={filteredFoods}
        />
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
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(3),
  },
  greeting: {
    fontSize: hp(1.8),
    color: "#A1A1AA",
  },
  heading: {
    fontSize: hp(2.8),
    fontWeight: "bold",
    color: "#27272A",
    marginTop: hp(0.5),
  },
  sectionTitle: {
    fontSize: hp(2.3),
    fontWeight: "700",
    color: "#27272A",
    marginHorizontal: wp(5),
    marginBottom: hp(1.5),
  },
  recipeHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(2),
  },
  categoryLabel: {
    marginRight: wp(5),
    color: "#F59E0B",
    fontSize: hp(1.6),
    fontWeight: "600",
  },
});
