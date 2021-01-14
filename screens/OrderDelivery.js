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
    console.log('currentLocation:', currentLocation);

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
    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={region}></MapView>
      </View>
    );
  }
  return <View style={{ flex: 1 }}>{renderMap()}</View>;
}
