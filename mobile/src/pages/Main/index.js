import React, { useState, useEffect } from "react";
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import api from "../../services/api";
import { connect, disconnect, subscribeToUpdatedBusLineLocations } from "../../services/socket";
import { create_UUID } from "../../utils/utils";
import Jsx from './view';


const current_user_id = create_UUID();

function Main({ navigation }) {
  //armazena o estado das linhas encontradas
  const [busLineLocations, setBusLineLocations] = useState([]);
  //armazena o estado da localização no mapa
  const [currentRegion, setCurrentRegion] = useState(null);
  //armazena o estado da localização no mapa
  const [myRegion, setMyRegion] = useState({
    latitude:0,
    longitude:0,
  });
  //armazena o estado da pesquisa
  const [searchBusLines, setSearchBusLines] = useState("");

  useEffect(() => {
    async function loadInicialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03
        });

        setMyRegion({
          latitude,
          longitude
        });
      }
    }

    loadInicialPosition();
  }, []);

  /**
   * Monitoring busLineLocations updated variable
   */
  useEffect(() => {
    subscribeToUpdatedBusLineLocations(updatedBusLineLocation => {
      const itemFounded = busLineLocations.find(item => {
        return item.user_id == updatedBusLineLocation.user_id;
      });

      //todo: eliminar os itens mais velhos que 10minutos
      if (itemFounded) {
        const newBusLineLocations = busLineLocations.map(function (oldBusLineLocation) {
          return oldBusLineLocation.user_id == updatedBusLineLocation.user_id
            ? updatedBusLineLocation
            : oldBusLineLocation;
        });
        setBusLineLocations(newBusLineLocations);
        console.log("update", newBusLineLocations);
      } else {
        const newBusLineLocations = [
          ...busLineLocations,
          updatedBusLineLocation
        ];
        setBusLineLocations(newBusLineLocations);
        console.log("create", newBusLineLocations);
      }
    });
  }, [busLineLocations]);

  /**
   * setup Web socket
   */
  function setupWebsocket() {
    const { latitude, longitude } = currentRegion;

    disconnect();
    connect(latitude, longitude, searchBusLines, current_user_id);
  }

  if (!currentRegion) {
    return null;
  }

  function buttonCallBackPesquisar(busline_code,busline_name){
    console.log('buttonCallBackPesquisar',busline_code,busline_name);
    
  }

  function buttonCallBackCompartilhar(busline_code,busline_name){
    console.log('buttonCallBackCompartilhar',busline_code,busline_name);    
  }

  function onPressShareMyLocation() {
    //navegacao
    navigation.navigate("ShareLocation", {
      type: 'share',
      buttonCallBack:buttonCallBackCompartilhar,
    });
  }

  async function onPressSearch() {
     //navegacao
     navigation.navigate("ShareLocation", {
      type: 'search',
      buttonCallBack:buttonCallBackPesquisar,
    });

    // if (!currentRegion) {
    //   return null;
    // }

    // const { latitude, longitude } = currentRegion;

    // const response = await api.get("/BusLineLocation", {
    //   params: {
    //     latitude,
    //     longitude,
    //     busline_search: searchBusLines
    //   }
    // });

    // setBusLineLocations(response.data.busLineLocation);
    // setupWebsocket();
  }

  function onRegionChangeComplete(region) {
    setCurrentRegion(region);
    onPressSearch();
  }

  return (
    <Jsx
      onRegionChangeComplete={onRegionChangeComplete}
      currentRegion={currentRegion}
      myRegion={myRegion}
      busLineLocations={busLineLocations}
      searchBusLines={searchBusLines}
      setSearchBusLines={setSearchBusLines}
      onPressSearch={onPressSearch}
      onPressShareMyLocation={onPressShareMyLocation}
    />
  );
}

export default Main;
