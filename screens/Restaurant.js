import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import { COLORS, icons, SIZES, FONTS } from '../constants';

export default function Restaurant({ route, navigation }) {
  const [restaurant, setRestaurant] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    let { item, currentLocation } = route.params;
    setRestaurant(item);
    setCurrentLocation(currentLocation);
  });

  function editOrder(action, menuId, price) {
    let orderList = orderItems.slice();
    let item = orderList.filter((a) => a.menuId === menuId);
    if (action == '+') {
      if (item.length > 0) {
        let newQty = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId: menuId,
          price: price,
          qty: 1,
          total: price,
        };
        orderList.push(newItem);
      }
      setOrderItems(orderList);
    } else {
      if (item.length > 0) {
        if (item[0].qty > 0) {
          let newQty = item[0].qty - 1;
          item[0].qty = newQty;
          item[0].total = item[0].qty * price;
        }
      }
      setOrderItems(orderList);
    }
  }

  function getOrderQty(menuId) {
    let orderItem = orderItems.filter((a) => a.menuId === menuId);

    if (orderItem.length > 0) {
      return orderItem[0].qty;
    }
    return 0;
  }

  function getBasketItemCount() {
    return orderItems.reduce((total, cur) => total + cur.qty, 0);
  }

  function sumOrder() {
    return orderItems.reduce((total, cur) => total + cur.total, 0).toFixed(2);
  }
  function renderHeader() {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
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
                  onPress={() => editOrder('-', item.menuId, item.price)}
                >
                  <Text style={{ ...FONTS.body1 }}>-</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: 37,
                    backgroundColor: COLORS.white,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ ...FONTS.h2 }}>{getOrderQty(item.menuId)}</Text>
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
                  onPress={() => editOrder('+', item.menuId, item.price)}
                >
                  <Text style={{ ...FONTS.body1 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Name & Description */}
            <View
              style={{
                width: SIZES.width,
                alignItems: 'center',
                marginTop: 15,
                paddingHorizontal: SIZES.padding * 2,
              }}
            >
              <Text style={{ marginVertical: 10, textAlign: 'center', ...FONTS.h2 }}>
                {item.name} - ${item.price.toFixed(2)}
              </Text>
              <Text style={{ ...FONTS.body3, justifyContent: 'center' }}>{item.description}</Text>
            </View>

            {/* Calories */}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Image source={icons.fire} style={{ width: 20, height: 20, marginRight: 10 }} />
              <Text style={{ color: COLORS.darkgray, ...FONTS.body3 }}>{item.calories.toFixed(2)} cal</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    );
  }

  function renderDots() {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View style={{ height: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: SIZES.padding }}>
          {restaurant?.menu.map((item, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
              extrapolate: 'clamp',
            });

            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={`dot-$${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                }}
              ></Animated.View>
            );
          })}
        </View>
      </View>
    );
  }

  function renderOrder() {
    return (
      <View>
        {renderDots()}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.lightGray2,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>{getBasketItemCount()} items in Cart</Text>
            <Text style={{ ...FONTS.h3 }}>$ {sumOrder()}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Image
                source={icons.pin}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.padding,
                  ...FONTS.h4,
                }}
              >
                Location
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={icons.mastercard}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4 }}>8888</Text>
            </View>
          </View>

          {/* Order Button */}
          <View style={{ padding: SIZES.padding * 2, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                width: SIZES.width * 0.9,
                padding: SIZES.padding,
                backgroundColor: COLORS.primary,
                borderRadius: SIZES.radius,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
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
