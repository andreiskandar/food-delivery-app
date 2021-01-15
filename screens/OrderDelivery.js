import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { COLORS, icons, SIZES, GOOGLE_API_KEY } from '../constants';
import MapViewDirections from 'react-native-maps-directions';
export default function OrderDelivery({ route, navigation }) {
  const mapView = useRef();

  const [restaurant, setRestaurant] = useState(null);
  const [streetName, setStreetName] = useState('');
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [region, setRegion] = useState(null);

  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [angle, setAngle] = useState(0);

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
        <Marker coordinate={fromLocation} anchor={{ x: 0.5, y: 0.5 }} flat={true} rotation={angle}>
          <Image source={icons.car} style={{ height: 25, width: 25 }} />
        </Marker>
      );
    };

    const calculateAngle = (coordinates) => {
      const [startLat, startLng] = coordinates[0];
      const [endLat, endLng] = coordinates[1];
      const dx = endLat - startLat;
      const dy = endLng - startLng;
      return (Math.atan2(dy, dx) * 180) / Math.PI;
    };

    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={region}>
          <MapViewDirections
            ref={mapView}
            origin={fromLocation}
            destination={toLocation}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor={COLORS.primary}
            optimizeWaypoints={true}
            onReady={(result) => {
              setDuration(result.duration);

              if (!isReady) {
                // Fit route into maps
                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: SIZES.width / 20,
                    bottom: SIZES.height / 4,
                    left: SIZES.width / 20,
                    top: SIZES.height / 8,
                  },
                });

                // Reposition the car
                let nextLoc = {
                  latitude: result.coordinates[0]['latitude'],
                  longitude: result.coordinates[0]['longitude'],
                };

                setFromLocation(nextLoc);
                setIsReady(true);

                if (result.coordinates.length >= 2) {
                  const angle = calculateAngle(result.coordinates);
                  setAngle(angle);
                }
              }
            }}
          />
          {destinationMarker()}
          {carIcon()}
        </MapView>
      </View>
    );
  }
  return <View style={{ flex: 1 }}>{renderMap()}</View>;
}
