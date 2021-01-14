import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { COLORS, icons, SIZES } from '../constants';
export default function OrderDelivery({ route, navigation }) {
  const [restaurant, setRestaurant] = useState(null);
  const [streetName, setStreetName] = useState('');
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const { restaurant, currentLocation } = route.params;

    const fromLoc = currentLocation.gps;
    const toLoc = restaurant.location;
    const street = currentLocation.streetName;

    const mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setRestaurant(restaurant);
    setStreetName(street);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);
  }, []);

  function renderMap() {
    const destinationMarker = () => {
      return (
        <Marker coordinate={toLocation}>
          <View
            style={{
              height: 25,
              width: 25,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.white,
            }}
          >
            <View
              style={{
                height: 15,
                width: 15,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
              }}
            >
              <Image source={icons.pin} style={{ width: 10, height: 10, tintColor: COLORS.white }} />
            </View>
          </View>
        </Marker>
      );
    };

    const carIcon = () => {
      return (
        <Marker
          coordinate={fromLocation}
          anchor={{ x: 0.5, y: 0.5 }}
          flat={true}
          //rotation
        >
          <Image source={icons.car} style={{ height: 30, width: 30 }} />
        </Marker>
      );
    };
    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={region}>
          {destinationMarker()}
          {carIcon()}
        </MapView>
      </View>
    );
  }
  return <View style={{ flex: 1 }}>{renderMap()}</View>;
}
