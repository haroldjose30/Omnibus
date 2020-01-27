import React, { useState, useEffect } from "react"
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location"
import api from "../../services/api"
import { connect, disconnect, subscribeToUpdatedBusLineLocations } from "../../services/socket"
import { create_UUID } from "../../utils/utils"
import Jsx from './view'
import * as Location from 'expo-location';
import Global from '../../utils/global'
import taskManager from '../../services/taskManager'

function Main({ navigation }) {

  //todo: make this global states
  const [currentMapRegion, setCurrentMapRegion] = useState(null)
  const [currentMyRegion, setCurrentMyRegion] = useState({
    latitude: 0,
    longitude: 0,
  })

  //local states
  const [busLineLocations, setBusLineLocations] = useState([])
  const [searchBusLineCode, setSearchBusLineCode] = useState("")
  const [searchBusLineName, setSearchBusLineName] = useState("")
  //TODO: Save this in local shared property, for same use until uninstall app
  //Load current UUID
  const [current_user_id] = useState(create_UUID())


  /**
   * Load on map my current position
   */
  async function setMyCurrentPositionOnMap() {
    const { granted } = await requestPermissionsAsync()

    if (granted) {

      const { latitude, longitude } = await getMyCurrentPosition()

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

  /**
   * Executed on start application
   * Request permission and get current posision from GPS
   */
  //TODO: make test when permission is denied by user
  useEffect(() => {
    Global.setCurrentMapRegionFun(setCurrentMapRegion)
    Global.setCurrentMyRegionFun(setCurrentMyRegion)
    Global.sendBusLineLocationToBackend(sendBusLineLocationToBackend)
    setMyCurrentPositionOnMap()
  }, [])

  /**
   * Monitoring busLineLocations updated variable
   * Subscribed to get updated locations from websocket backend
   */
  useEffect(() => {
    subscribeToUpdatedBusLineLocations(updatedBusLineLocation => {
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
   * send My Current LineBus Location To Backend
   * This process will update via WebSocket to another user
   */
  async function sendBusLineLocationToBackend(region,busline_code,busline_name) {
    console.log('sendBusLineLocationToBackend',region,busline_code,busline_name);
   
    if (region == null) {
      region = currentMyRegion
    }

    if (busline_code ==  undefined || busline_code ==  null ) {
      busline_code = searchBusLineCode
      console.log('searchBusLineCode',searchBusLineCode,busline_code);
      
    }

    if (busline_name ==  undefined || busline_name ==  null) {
      busline_name = searchBusLineName
      console.log('searchBusLineName',searchBusLineName,busline_name);
    }

    const { latitude, longitude } = region

    if (!latitude || !longitude) {
      return
    }

    console.log('sendBusLineLocationToBackend',latitude,longitude,busline_code,busline_name);
    await api.post("/BusLineLocation", {
      user_id:current_user_id,
      latitude,
      longitude,
      busline_code,
      busline_name
    }).catch(error => {
      //TODO: catch api error 500, 400, etc
      console.debug('error:', error)
    });

  }

  /**
   * trigger event each current located is updated 
   */
  async function startLocationUpdates() {
    await Location.startLocationUpdatesAsync(Global.BACKGROUD_LOCATION_UPDATE_TASK, {
      accuracy: Location.Accuracy.High,
      showsBackgroundLocationIndicator: true,
      // timeInterval: 60000,
      // distanceInterval: 1000,
      // foregroundService: {
      //   notificationTitle: "Omnistack embarcado",
      //   notificationBody: "atualizando localização"
      // },
    });

  }



  /**
   * retorna a localização atual do device
   */
  async function getMyCurrentPosition() {
    const { coords } = await getCurrentPositionAsync({
      enableHighAccuracy: true
    })

    return { latitude: coords.latitude, longitude: coords.longitude }
  }

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

  /**
   * start sharing location based on busLine clicked or when callback from form input data page
   */
  async function onPressShareMyLocationCallBack(busline_code, busline_name) {
    setSearchBusLineCode(busline_code)
    setSearchBusLineName(busline_name)
    await setMyCurrentPositionOnMap()
    await sendBusLineLocationToBackend(currentMyRegion,busline_code,busline_name)
    startLocationUpdates()
  }

  /**
   * Click button to share my location, will send the user to ShareLocation Page
   */
  function onPressShareMyLocation() {

    navigation.navigate("ShareLocation", {
      type: 'share',
      buttonCallBack: onPressShareMyLocationCallBack,
      inputBusLineCodeValue: searchBusLineCode,
      inputBusLineNameValue: searchBusLineName,
      inputBusLineCodeRequired: true,
      inputBusLineNameRequired: true,
    })
  }

  /**
   * Filter data to search a especific busLine
   */
  function onPressSearch() {

    /**
     * Callback function when user come back from ShareLocation Page 
     */
    function onPressSearchCallBack(busline_code, busline_name) {
      setSearchBusLineCode(busline_code)
      setSearchBusLineName(busline_name)
      LoadBusLineFromRegion(currentMapRegion, busline_code, busline_name)
    }

    navigation.navigate("ShareLocation", {
      type: 'search',
      buttonCallBack: onPressSearchCallBack,
      inputBusLineCodeValue: searchBusLineCode,
      inputBusLineNameValue: searchBusLineName,
      inputBusLineCodeRequired: false,
      inputBusLineNameRequired: false,
    })
  }


  /**
   * handler when user change position manualy in map
   * Load bus lines from selected region, by 10km radiuns
   */
  function onRegionChangeComplete(region) {
    console.log('onRegionChangeComplete');
    setCurrentMapRegion(region)
    LoadBusLineFromRegion(region, searchBusLineCode, searchBusLineName)
  }

  /**
   * seach all busline by code or name from specific region, by 10km radius
   * @param {region, latitude and longitud} region 
   * @param {number of bus line} busline_code 
   * @param {name of bus line} busline_name 
   */
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
      console.debug('error:', error)
    });

    if (response && response.data && response.data.busLineLocation) {
      setBusLineLocations(response.data.busLineLocation)
      setupWebsocket()
    }

  }

  /**
   * return View from Jsx Template file
   */
  return (
    <Jsx
      onRegionChangeComplete={onRegionChangeComplete}
      currentMapRegion={currentMapRegion}
      currentMyRegion={currentMyRegion}
      busLineLocations={busLineLocations}
      onPressSearch={onPressSearch}
      onPressShareMyLocation={onPressShareMyLocation}
      onPressShareMyLocationDirect={onPressShareMyLocationCallBack}
    />
  )
}

export default Main
