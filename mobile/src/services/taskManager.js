import * as TaskManager from 'expo-task-manager';
import Global from '../utils/global'

console.log('TaskManager STARTED');

TaskManager.defineTask(Global.BACKGROUD_LOCATION_UPDATE_TASK, ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      console.debug('Received new locations error', error);
      return
    }

    if (locations && locations.length > 0) {
  
      const { latitude, longitude } = locations[0].coords
  
      //TODO: Create a zoom button on map and save state this latitudeDelta 
      Global.setCurrentMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
      })
  
      Global.setCurrentMyRegion({
        latitude,
        longitude
      })

      Global.sendBusLineLocationToBackend({
        latitude,
        longitude
      })
    }
  });
  
  
  