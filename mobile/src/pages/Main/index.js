import React, { useState, useEffect } from "react"
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location"
import api from "../../services/api"
import { connect, disconnect, subscribeToUpdatedBusLineLocations } from "../../services/socket"
import { create_UUID } from "../../utils/utils"
import Jsx from './view'

/**
 * Load current UUID
 */



function Main({ navigation }) {


  //declare state from components
  const [busLineLocations, setBusLineLocations] = useState([])
  const [currentMapRegion, setCurrentMapRegion] = useState(null)
  const [currentMyRegion, setCurrentMyRegion] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [searchBusLineCode, setSearchBusLineCode] = useState("")
  const [searchBusLineName, setSearchBusLineName] = useState("")
  //TODO: Save this in local shared property, for same use until uninstall app
  const current_user_id = create_UUID()

  /**
   * Executed on start application
   * Request permission and get current posision from GPS
   */
  //TODO: make test when permission is denied by user
  useEffect(() => {

    async function loadInicialPosition() {
      const { granted } = await requestPermissionsAsync()

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        })

        const { latitude, longitude } = coords

        setCurrentMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03
        })

        setCurrentMyRegion({
          latitude,
          longitude
        })
      }
    }


    loadInicialPosition()
  }, [])

  /**
   * Monitoring busLineLocations updated variable
   * Subscribed to get updated locations from websocket backend
   */
  useEffect(() => {
      subscribeToUpdatedBusLineLocations(updatedBusLineLocation => {
        //console.log('updatedBusLineLocation',updatedBusLineLocation);
        console.log('busLineLocations',busLineLocations);
      
        const itemFounded = busLineLocations.find(item => {
          return item.user_id == updatedBusLineLocation.user_id
        })
  
        //TODO: Need to ignore locations older than 10 minutes
        if (itemFounded) {
          const newBusLineLocations = busLineLocations.map(function (oldBusLineLocation) {
            return oldBusLineLocation.user_id == updatedBusLineLocation.user_id
              ? updatedBusLineLocation
              : oldBusLineLocation
          })
          setBusLineLocations(newBusLineLocations)
        } else {
          const newBusLineLocations = [
            ...busLineLocations,
            updatedBusLineLocation
          ]
          setBusLineLocations(newBusLineLocations)
        }
      })
    
  }, [busLineLocations])

  /**
   * setup Web socket
   */
  function setupWebsocket() {
   

    if (!currentMapRegion) {
      return
    }

    const { latitude, longitude } = currentMapRegion
    disconnect()
    connect(latitude, longitude, searchBusLineCode, searchBusLineName, current_user_id)
  }



  function onPressShareMyLocation() {

    function buttonCallBackCompartilhar(busline_code, busline_name) {
      //TODO: not implemented
    }


    navigation.navigate("ShareLocation", {
      type: 'share',
      buttonCallBack: buttonCallBackCompartilhar,
      inputBusLineCodeValue: searchBusLineCode,
      inputBusLineNameValue: searchBusLineName,
      inputBusLineCodeRequired: true,
      inputBusLineNameRequired: true,
    })
  }



  async function onPressSearch() {

    function buttonCallBackPesquisar(busline_code, busline_name) {
      setSearchBusLineCode(busline_code)
      setSearchBusLineName(busline_name)
      LoadBusLineFromRegion(currentMapRegion, busline_code, busline_name)
    }

    navigation.navigate("ShareLocation", {
      type: 'search',
      buttonCallBack: buttonCallBackPesquisar,
      inputBusLineCodeValue: searchBusLineCode,
      inputBusLineNameValue: searchBusLineName,
      inputBusLineCodeRequired: false,
      inputBusLineNameRequired: false,
    })
  }



  function onRegionChangeComplete(region) {
    setCurrentMapRegion(region)
    LoadBusLineFromRegion(region, searchBusLineCode, searchBusLineName)
  }

  async function LoadBusLineFromRegion(region, busline_code, busline_name) {
   
    if (!region) {
      return
    }

    const { latitude, longitude } = region

    if (!latitude || !longitude) {
      return
    }

    const response = await api.get("/BusLineLocation", {
      params: {
        latitude,
        longitude,
        busline_code,
        busline_name
      }
    }).catch(error => {
      //TODO: catch api error 500, 400, etc
      console.log('error:', error)
    });

    if (response && response.data && response.data.busLineLocation) {
      setBusLineLocations(response.data.busLineLocation)
      setupWebsocket()
    }

  }

  return (
    <Jsx
      onRegionChangeComplete={onRegionChangeComplete}
      currentMapRegion={currentMapRegion}
      currentMyRegion={currentMyRegion}
      busLineLocations={busLineLocations}
      onPressSearch={onPressSearch}
      onPressShareMyLocation={onPressShareMyLocation}
    />
  )
}

export default Main
