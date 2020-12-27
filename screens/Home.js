import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Platform } from 'react-native';
import { COLORS, icons, SIZES, FONTS } from '../constants';
import { initialCurrentLocation, categoryData, restaurantData } from '../mock/data';
export default function Home() {
  const [categories, setCategories] = useState(categoryData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [restaurants, setRestaurants] = useState(restaurantData);
  const [currentLocation, setCurrentLocation] = useState(initialCurrentLocation);

  function onSelectCategory(category) {
    // filter restaurant
    let restaurantList = restaurantData.filter((restaurant) => restaurant.categories.includes(category.id));
    setRestaurants(restaurantList);
    setSelectedCategory(category);
  }

  function getCategoryNameById(id) {
    const filteredCategory = categories.filter((category) => category.id === id);
    return filteredCategory.length > 0 ? filteredCategory[0].name : '';
  }

  function renderHeader() {
    return (
      <View style={{ flexDirection: 'row', height: 50 }}>
        <TouchableOpacity
          style={{
            width: 30,
            height: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}
        >
          <Image source={icons.nearby} resizeMode='contain' style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: COLORS.lightGray3,
              width: '70%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: SIZES.radius,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>{initialCurrentLocation.streetName}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: 50, paddingRight: SIZES.padding * 2, justifyContent: 'center' }}>
          <Image
            source={icons.basket}
            resizeMode='contain'
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderMainCategories() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            padding: SIZES.padding,
            paddingBottom: SIZES.padding * 0.1,
            backgroundColor: selectedCategory?.id === item.id ? COLORS.primary : COLORS.white,
            borderRadius: SIZES.radius,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SIZES.padding,
            ...styles.shadow,
          }}
          onPress={() => onSelectCategory(item)}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.white,
            }}
          >
            <Image
              source={item.icon}
              resizeMode='contain'
              style={{
                width: 30,
                height: 30,
                backgroundColor: selectedCategory?.id === item.id ? COLORS.white : COLORS.lightGray,
              }}
            />
          </View>
          <Text
            style={{
              marginTop: SIZES.padding,
              color: selectedCategory?.id === item.id ? COLORS.white : COLORS.black,
              ...FONTS.body5,
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ padding: SIZES.padding * 2 }}>
        <Text style={{ ...FONTS.h1 }}>Main</Text>
        <Text style={{ ...FONTS.h1 }}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
        ></FlatList>
      </View>
    );
  }

  function renderRestaurantList() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{ marginBottom: SIZES.padding * 2 }}
        //onPress -> navigate to restaurant screen
      >
        {/* Image */}
        <View style={{ marginBottom: SIZES.padding }}>
          <Image
            source={item.photo}
            resizeMode='cover'
            style={{ width: '100%', height: 200, borderRadius: SIZES.radius }}
          ></Image>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              height: 50,
              width: SIZES.width * 0.3,
              backgroundColor: COLORS.white,
              borderTopRightRadius: SIZES.radius,
              borderBottomLeftRadius: SIZES.radius,
              alignItems: 'center',
              justifyContent: 'center',
              ...styles.shadow,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>{item.duration}</Text>
          </View>
        </View>

        {/* Restaurant Info */}
        <Text style={{ ...FONTS.body2 }}>{item.name}</Text>

        <View style={{ marginTop: SIZES.padding, flexDirection: 'row' }}>
          {/* Rating */}
          <Image
            source={icons.star}
            style={{ width: 20, height: 20, tintColor: COLORS.primary, marginRight: 10 }}
          ></Image>
          <Text style={{ ...FONTS.body3 }}>{item.rating}</Text>

          {/* Categories */}
          <View style={{ flexDirection: 'row', marginLeft: 10 }}>
            {item.categories.map((categoryId) => {
              return (
                <View style={{ flexDirection: 'row' }} key={categoryId}>
                  <Text style={{ ...FONTS.body3 }}>{getCategoryNameById(categoryId)}</Text>
                  <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}> . </Text>
                </View>
              );
            })}
          </View>

          {/* Price rating */}
          {[1, 2, 3].map((priceRating) => (
            <Text
              key={priceRating}
              style={{ ...FONTS.body3, color: priceRating <= item.priceRating ? COLORS.black : COLORS.darkgray }}
            >
              $
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={restaurants}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding * 2, paddingBottom: 30 }}
      ></FlatList>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderMainCategories()}
      {renderRestaurantList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0 },
  },
});
