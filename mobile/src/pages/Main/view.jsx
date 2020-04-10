import React from "react";
import { Image, Text, View, TextInput, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import styles from './styles';


const Jsx = (props) => {

  //TODO: Import icon to local acessts
  const iconUri = "https://cdn6.aptoide.com/imgs/f/0/a/f0a6c5b67396977df7890b276e9f0ee2_icon.png?w=256";

  const {
    onRegionChangeComplete,
    currentMapRegion,
    currentMyRegion,
    busLineLocations,
    onPressSearch,
    onPressShareMyLocation,
    onPressShareMyLocationDirect,
  } = props;

  if (!currentMapRegion) {
    
    return (<Text style={styles.mapBlank}>Carregando...</Text>)
  }

  return (
    <>
      <Text>{currentMapRegion.latitude}/{currentMapRegion.longitude}</Text>
      <MapView
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={currentMapRegion}
        region={currentMapRegion}
        style={styles.map}
      >
        <Marker
          key="me"
          coordinate={{
            latitude: currentMyRegion.latitude,
            longitude: currentMyRegion.longitude,
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
            <Callout style={{flexDirection:'row'}} onPress={() => { onPressShareMyLocation(bus.busline_code,bus.busline_name); }} >
              <View style={styles.mapBusMarckCallout}>
                <Text style={styles.mapBusMarckCalloutTitle}>
                  {bus.busline_code}-{bus.busline_name}
                </Text>
                <View style={styles.mapBusMarckCalloutTitle}>
                    {/* <TouchableOpacity style={styles.mapBusMarckCalloutButtonShare}> */}
                    <View style={{flexDirection:"row",alignItems: "center"}}>
                      <MaterialIcons name="directions-bus" size={30} color="black" />
                      <Text> Embarcar</Text>     
                    </View>      
                  {/* </TouchableOpacity> */}
                  </View>
                </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
        <TouchableOpacity onPress={() => { onPressShareMyLocation(); }} style={styles.floatButtonShare}>
          <MaterialIcons name="directions-bus" size={30} color="black" />
        </TouchableOpacity>

        {//TODO: this feature to search has a bug, we need divide variables when sharing then searching, this causing conflicts
        /* <TouchableOpacity onPress={() => { onPressSearch(); }} style={styles.floatButtonSearch}>
          <MaterialIcons name="search" size={30} color="black" />
        </TouchableOpacity> */}
    </>
  );
};


export default Jsx