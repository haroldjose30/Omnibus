import {Platform} from 'react-native';



export default class Global {

  static BACKGROUD_LOCATION_UPDATE_TASK = "BACKGROUD_LOCATION_UPDATE_TASK"
  static API_URL = (Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://192.168.100.106:3333')

  static _currentMapRegionFun = null;
  static _currentMyRegionFun = null;
  static _sendBusLineLocationToBackendFun = null
  static _updateBusLineRegionFun = null

  static setCurrentMapRegionFun(fun) {
    this._currentMapRegionFun = fun
  }

  static setCurrentMapRegion(data) {
    if (this._currentMapRegionFun != null) {
      this._currentMapRegionFun(data)
    }
  }

  static setCurrentMyRegionFun(fun) {
    this._currentMyRegionFun = fun
  }

  static setCurrentMyRegion(data) {
    if (this._currentMyRegionFun != null) {
      this._currentMyRegionFun(data)
    }
  }

  static sendBusLineLocationToBackendFun(fun) {
    this._sendBusLineLocationToBackendFun = fun
  }

  static sendBusLineLocationToBackend(region) {
    if (this._sendBusLineLocationToBackendFun != null) {
      this._sendBusLineLocationToBackendFun(region)
    }
  }



  static updateBusLineRegionFun(fun) {
    this._updateBusLineRegionFun = fun
  }

  static updateBusLineRegion(latitude,longitude) {
    if (this._updateBusLineRegionFun != null) {
      this._updateBusLineRegionFun(latitude,longitude)
    }
  }


  
  

}