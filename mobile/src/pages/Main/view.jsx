import React from "react";
import { Image, Text, View, TextInput, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import styles from './styles';


const Jsx = (props) => {

  //const iconUri = "https://media.cdnandroid.com/ff/f6/57/cf/imagen-bus-brazil-0thumb.jpg";
  const iconUri =
    "https://cdn6.aptoide.com/imgs/f/0/a/f0a6c5b67396977df7890b276e9f0ee2_icon.png?w=256";

  const {
    onRegionChangeComplete,
    currentRegion,
    myRegion,
    busLineLocations,
    searchBusLines,
    setSearchBusLines,
    onPressSearch,
    onPressShareMyLocation,
  } = props;

  console.log('myRegion',myRegion);
  
  return (
    <>
      <MapView
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={currentRegion}
        style={styles.map}
      >
        <Marker
            key="me"
            coordinate={{
              latitude: myRegion.latitude,
              longitude: myRegion.longitude,
            }}
          ></Marker>
        {busLineLocations.map(bus => (
          <Marker
            key={bus.user_id}
            coordinate={{
              latitude: bus.location.coordinates[1],
              longitude: bus.location.coordinates[0]
            }}
          >
            <Image style={styles.mapBusMarckIcon} source={{ uri: iconUri }} />
            <Text style={styles.mapBusMarckText}>{bus.busline_code}</Text>
            <Callout onPress={() => {}}>
              <View style={styles.mapBusMarckCallout}>
                <Text style={styles.mapBusMarckCalloutTitle}>
                  {bus.busline_code}-{bus.busline_name}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TouchableOpacity onPress={() => { onPressShareMyLocation(); }} style={styles.floatButton}>
          <MaterialIcons name="directions-bus" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { onPressSearch(); }} style={styles.floatButton}>
          <MaterialIcons name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>

    </>
  );
};


export default Jsx