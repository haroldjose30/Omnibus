const BusLineLocation = require("../models/BusLineLocation");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  /**
   * Return all location in determined region
   */
  async index(request, response) {
    const { latitude, longitude, busline_search } = request.query;

    //buscar todos num raio 10km
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

    //verify if needed filter by line code or description
    if (busline_search != null && busline_search.trim() !== "") {
      //if integer search by code
      if (!isNaN(busline_search)) {
        busLineLocations = await BusLineLocation.find({
          location: locationSearch,
          busline_code: busline_search
          //datetime: dateSearch,
        });
      } else {
        //search by name
        busLineLocations = await BusLineLocation.find({
          location: locationSearch,
          busline_name: { $regex: busline_search }
          //datetime: dateSearch,
        });
      }
      return response.json({ busLineLocation: busLineLocations });
    }

    busLineLocations = await BusLineLocation.find({
      location: locationSearch
      //datetime: dateSearch,
    });

    return response.json({ busLineLocation: busLineLocations });
  },

  /**
   * Create a new User
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
    let busLineLocation = await BusLineLocation.findOne( { user_id: user_id });
    

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

    busLineLocation = await BusLineLocation.findOne( { user_id: user_id });

    //get all connections where needed receice updated location
    const sendSocketMessageTo = findConnections({ latitude, longitude }, "");

    //send data for the receivers
    sendMessage(sendSocketMessageTo,"Updated-BusLineLocations",busLineLocation);

    console.log('busLineLocation',busLineLocation);

    return response.json({ busLineLocation });
  }
};
