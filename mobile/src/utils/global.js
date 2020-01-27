



export default class Global {

    static BACKGROUD_LOCATION_UPDATE_TASK = "BACKGROUD_LOCATION_UPDATE_TASK"

    static _currentMapRegionFun = null;
    static _currentMyRegionFun = null;
    static _sendBusLineLocationToBackendFun = null
  
    static setCurrentMapRegionFun (fun) {
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

    static sendBusLineLocationToBackendFun(fun){
      this.sendBusLineLocationToBackend = fun
    }

    static sendBusLineLocationToBackend(region){
      if (this.sendBusLineLocationToBackendFun != null) {
        this.sendBusLineLocationToBackendFun(region)
      }
    }

  }