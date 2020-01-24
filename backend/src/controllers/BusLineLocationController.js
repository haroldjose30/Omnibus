const BusLineLocation = require('../models/BusLineLocation');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  /**
   * Return all location in determined region
   */
  async index(request, response) {
    const { latitude, longitude, busline_code, busline_name } = request.query;

    

    //Filter all buslins on 10km radius, from coordenates
    const locationSearch = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: 10000
      }
    };

    //get data newer then 10 minutes
    const date = new Date();
    date.setMinutes(date.getMinutes() - 10);
    const dateSearch = { $gte: date };

    let busLineLocations = [];

    //verify if needed filter by Bus line code 
    if (busline_code && busline_code.trim() !== "") {
      
      busLineLocations = await BusLineLocation.find({
        location: locationSearch,
        busline_code: busline_code,
        //datetime: dateSearch,
      });

      return response.json({ busLineLocation: busLineLocations });
    }


    //verify if needed filter by Bus line name 
    if (busline_name && busline_name.trim() !== "") {
      busLineLocations = await BusLineLocation.find({
        location: locationSearch,
        busline_name: { $regex: busline_name }
        //datetime: dateSearch,
      });

      return response.json({ busLineLocation: busLineLocations });
    }


    busLineLocations = await BusLineLocation.find({
      location: locationSearch
      //datetime: dateSearch,
    });

    return response.json({ busLineLocation: busLineLocations });
  },

  /**
   * register a new location for a Bus line
   */
  async store(request, response) {
    const {
      user_id,
      busline_code,
      busline_name,
      latitude,
      longitude
    } = request.body;

    const datetime = new Date();

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };


    //verify if this user has one connection
    let busLineLocation = await BusLineLocation.findOne({ user_id: user_id });


    if (!busLineLocation) {
      await BusLineLocation.create({
        user_id,
        datetime,
        busline_code,
        busline_name,
        location
      });
    } else {
      await BusLineLocation.updateOne(
        { user_id: user_id },
        {
          user_id,
          datetime,
          busline_code,
          busline_name,
          location
        }
      );
    }

    busLineLocation = await BusLineLocation.findOne({ user_id: user_id });

    //get all connections where needed receice updated location
    const sendSocketMessageTo = findConnections({ latitude, longitude }, busline_code, busline_name);

    console.log('sendSocketMessageTo',sendSocketMessageTo,busLineLocation);
    
    //send data for the receivers
    sendMessage(sendSocketMessageTo, "Updated-BusLineLocations", busLineLocation);

  
    return response.json({ busLineLocation });
  }
};
