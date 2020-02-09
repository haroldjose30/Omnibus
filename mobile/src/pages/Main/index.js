import React, { useState, useEffect } from "react"
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location"
import api from "../../services/api"
import { connect, disconnect, subscribeToEvent } from "../../services/socket"
import { getUserUUID } from "../../utils/utils"
import Jsx from './view'
import * as Location from 'expo-location';
import Global from '../../utils/global'

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
  const [current_user_id, setCurrentUserId] = useState("")


  async function updateBusLineRegion(latitude, longitude) {
    let user_id = await getCurrentUserId()
    let newBusLineLocation = {
      user_id:  user_id,
      datetime: new Date(),
      busline_code: this.searchBusLineCode,
      busline_name: this.searchBusLineName,
      location: {
        coordinates: [ longitude, latitude ],
      },
    }

    console.log(Platform.OS,'updateBusLineRegion-newBusLineLocation',newBusLineLocation);
    updateBusLineLocation(newBusLineLocation)
  }


  async function getCurrentUserId() {
    if (current_user_id == '') {
      let uuid = await getUserUUID()
      setCurrentUserId(uuid)
      return uuid
    }

    return current_user_id;
  }

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
    Global.updateBusLineRegionFun(updateBusLineRegion)
    Global.sendBusLineLocationToBackendFun(sendBusLineLocationToBackend)
    setMyCurrentPositionOnMap()
  }, [])

  /**
   * Monitoring busLineLocations updated variable
   * Subscribed to get updated locations from websocket backend
   */
  useEffect(() => {
    const socketEventName = 'Updated-BusLineLocations'
    subscribeToEvent(socketEventName, subscribeToUpdatedBusLineLocations)

  }, [busLineLocations])


  function subscribeToUpdatedBusLineLocations(newBusLineLocation) {
    updateBusLineLocation(newBusLineLocation)
  }

  function updateBusLineLocation(newBusLineLocation) {
    console.log(Platform.OS, 'busLineLocations', busLineLocations);
    console.log(Platform.OS, 'updatedBusLineLocation', newBusLineLocation);
    console.log(Platform.OS, '------------------------------');

    const itemFounded = busLineLocations.find(item => {
      return item.user_id == newBusLineLocation.user_id
    })


    //TODO: Need to ignore locations older than 10 minutes
    if (itemFounded) {
      const newBusLineLocations = busLineLocations.map(function (oldBusLineLocation) {
        return oldBusLineLocation.user_id == newBusLineLocation.user_id
          ? newBusLineLocation
          : oldBusLineLocation
      })
      setBusLineLocations(newBusLineLocations)
    } else {
      const newBusLineLocations = [
        ...busLineLocations,
        newBusLineLocation
      ]

      setBusLineLocations(newBusLineLocations)
    }
  }


  /**
   * send My Current LineBus Location To Backend
   * This process will update via WebSocket to another user
   */
  async function sendBusLineLocationToBackend(region, busline_code, busline_name) {
    if (region == null) {
      region = currentMyRegion
    }

    if (typeof (busline_code) == 'undefined' || busline_code == null) {
      busline_code = searchBusLineCode
    }

    if (typeof (busline_name) == 'undefined' || busline_name == null) {
      busline_name = searchBusLineName
    }

    const { latitude, longitude } = region

    if (!latitude || !longitude) {
      return
    }

    if (busline_code == '') {
      return
    }

    let user_id = await getCurrentUserId()
    await api.post("/BusLineLocation", {
      user_id: user_id,
      latitude,
      longitude,
      busline_code,
      busline_name
    }).catch(error => {
      //TODO: catch api error 500, 400, etc
      console.debug('error:', error)
    });

    console.log(Platform.OS,'sendBusLineLocationToBackend',{
      user_id: user_id,
      latitude,
      longitude,
      busline_code,
      busline_name
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
  async function setupWebsocket() {


    if (!currentMapRegion) {
      return
    }

    const { latitude, longitude } = currentMapRegion
    disconnect()
    let user_id = await getCurrentUserId()
    connect(latitude, longitude, searchBusLineCode, searchBusLineName, user_id)
  }

  /**
   * start sharing location based on busLine clicked or when callback from form input data page
   */
  async function onPressShareMyLocationCallBack(busline_code, busline_name) {
    setSearchBusLineCode(busline_code)
    setSearchBusLineName(busline_name)
    await setMyCurrentPositionOnMap()
    await sendBusLineLocationToBackend(currentMyRegion, busline_code, busline_name)

    let user_id = await getCurrentUserId()
    const { latitude, longitude } = currentMapRegion
    let newBusLineLocation = {
      user_id:  user_id,
      datetime: new Date(),
      busline_code: busline_code,
      busline_name: busline_name,
      location: {
        coordinates: [ longitude, latitude ],
      },
    }
    updateBusLineLocation(newBusLineLocation)
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
      await setupWebsocket()
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
