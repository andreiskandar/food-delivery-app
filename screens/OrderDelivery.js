import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { COLORS, icons, FONTS, SIZES, GOOGLE_API_KEY } from '../constants';
import MapViewDirections from 'react-native-maps-directions';
import { TouchableOpacity } from 'react-native-gesture-handler';
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

  function zoomIn() {
    const newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitude / 2,
      longitudeDelta: region.longitude / 2,
    };
    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }
  function zoomOut() {
    const newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitude * 2,
      longitudeDelta: region.longitude * 2,
    };
    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }

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

              // if (!isReady) {
              //   // Fit route into maps
              //   mapView.current.fitToCoordinates(result.coordinates, {
              //     edgePadding: {
              //       right: SIZES.width / 20,
              //       bottom: SIZES.height / 4,
              //       left: SIZES.width / 20,
              //       top: SIZES.height / 8,
              //     },
              //   });

              //   // Reposition the car
              //   let nextLoc = {
              //     latitude: result.coordinates[0]['latitude'],
              //     longitude: result.coordinates[0]['longitude'],
              //   };

              //   setFromLocation(nextLoc);
              //   setIsReady(true);

              //   if (result.coordinates.length >= 2) {
              //     const angle = calculateAngle(result.coordinates);
              //     setAngle(angle);
              //   }
              // }
            }}
          />
          {destinationMarker()}
          {carIcon()}
        </MapView>
      </View>
    );
  }

  function renderDestinationHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 30,
          left: 50,
          right: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}
        >
          <Image source={icons.red_pin} style={{ height: 30, width: 30, marginRight: SIZES.padding }} />
          <View style={{ flex: 1 }}>
            <Text style={{ ...FONTS.body3 }}>{streetName}</Text>
          </View>
          <Text style={{ ...FONTS.body3 }}>{Math.ceil(duration)} mins</Text>
        </View>
      </View>
    );
  }

  function renderDeliveryInfo() {
    return (
      <View
        style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}
      >
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            backgroundColor: COLORS.white,
            borderRadius: SIZES.radius,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={restaurant?.courier.avatar} style={{ width: 40, height: 40, borderRadius: 25 }} />
            <View style={{ flex: 1, marginLeft: SIZES.padding }}>
              {/* Name & Rating */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...FONTS.h4 }}>{restaurant?.courier.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={icons.star} style={{ width: 20, height: 20, marginRight: SIZES.padding }} />
                  <Text style={{ ...FONTS.body3 }}>{restaurant?.rating}</Text>
                </View>
              </View>
              {/* Restaurant */}
              <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>{restaurant?.name}</Text>
            </View>
          </View>
          {/* Button */}
          <View style={{ flexDirection: 'row', marginTop: SIZES.padding * 2, justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                height: 40,
                marginRight: 10,
                width: SIZES.width * 0.55 - SIZES.padding * 6,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                width: SIZES.width * 0.53 - SIZES.padding * 6,
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderZoomButtons() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: SIZES.height * 0.35,
          right: SIZES.padding * 2,
          width: 60,
          height: 130,
          justifyContent: 'space-between',
        }}
      >
        {/* Zoom In */}
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => zoomIn()}
        >
          <Text style={{ ...FONTS.body1 }}>+</Text>
        </TouchableOpacity>

        {/* Zoom Out */}
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => zoomOut()}
        >
          <Text style={{ ...FONTS.body1 }}>-</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {renderMap()}
      {renderDestinationHeader()}
      {renderDeliveryInfo()}
      {renderZoomButtons()}
    </View>
  );
}
