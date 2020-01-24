const calculateDistance = require("./Utils/calculateDistance");

const socketio = require("socket.io");

const connections = [];

let io;

/**
 * Configuring websockets
 */
exports.setupWebsocket = server => {
  const token = 'token'
  const cookie = 'cookie'
  io = socketio(server);

  //monitoring the clients connections
  io.on("connection", socket => {

    //extract query parameters from connections
    const {
      latitude,
      longitude,
      searchBusLineCode,
      searchBusLineName,
      user_id
    } = socket.handshake.query;
    
    console.log('socket.handshake.query',socket.handshake.query);
    

    //remove an connection from the same user
    const connectionFromThisUser = connections.find(connection => {
      return connection.user_id == user_id;
    });

    //if connection exists remove then
    if (connectionFromThisUser) {
      const index = connections.indexOf(connectionFromThisUser);
      connections.splice(index, 1);
    }

    //add new connection
    connections.push({
      id: socket.id,
      user_id: user_id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      searchBusLineCode:searchBusLineCode,
      searchBusLineName: searchBusLineName,
      datetime: new Date()
    });
    

    //when client disconnect remove from array
    socket.once("disconnect", () => {
      const disconnectedConnection = connections.find(connection => {
        return connection.id == socket.id;
      });

      if (disconnectedConnection) {
        const index = connections.indexOf(disconnectedConnection);
        connections.splice(index, 1);
      }
    });
  });
};

/**
 * Return connection with math query filters
 */
exports.findConnections = (coordinates, searchBusLineCode,searchBusLineName) => {
  console.log('connections',connections);
  
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10; //10 kilometers
    //TODO: filter by buslineCode or BusLineName
    //&& connection.searchBusLines.some(item => searchBusLines == item) //todo: make filter by line number or description
  });
};

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
