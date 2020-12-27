import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import { COLORS, icons, SIZES, FONTS } from '../constants';

export default function Restaurant({ route, navigation }) {
  const [restaurant, setRestaurant] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    let { item, currentLocation } = route.params;
    setRestaurant(item);
    setCurrentLocation(currentLocation);
  });

  function renderHeader() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ width: 50, paddingLeft: SIZES.padding * 2, justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Image source={icons.back} resizeMode='contain' style={{ width: 30, height: 30 }}></Image>
        </TouchableOpacity>

        {/* Restaurant Name Section */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: SIZES.padding * 2,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray3,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>{restaurant?.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: 50, paddingRight: SIZES.padding * 2, justifyContent: 'center' }}>
          <Image source={icons.list} resizeMode='contain' style={{ width: 30, height: 30 }}></Image>
        </TouchableOpacity>
      </View>
    );
  }

  function renderFoodInfo() {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle
        snapToAlignment='center'
        showsHorizontalScrollIndicator={false}

        // onScroll
      >
        {restaurant?.menu.map((item, idx) => (
          <View key={`menu-${idx}`} style={{ alignItems: 'center' }}>
            <View style={{ height: SIZES.height * 0.35 }}>
              {/* Render Food Image */}
              <Image source={item.photo} resizeMode='cover' style={{ width: SIZES.width, height: '100%' }} />

              {/* Quantity */}
              <View
                style={{
                  position: 'absolute',
                  bottom: -20,
                  width: SIZES.width,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                  }}
                >
                  <Text style={{ ...FONTS.body1 }}>-</Text>
                </TouchableOpacity>
                <View
                  style={{ backgroundColor: COLORS.white, width: 50, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ ...FONTS.h1 }}>5</Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                  }}
                >
                  <Text style={{ ...FONTS.body1 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
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
