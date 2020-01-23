import socketio from 'socket.io-client'
import { Logs } from 'expo';

const socket = socketio('http://localhost:3333',{
    autoConnect:false,
});

function subscribeToUpdatedBusLineLocations(subscribeFunction) {
    socket.on('Updated-BusLineLocations',subscribeFunction)
}


function connect(latitude,longitude,searchBusLines,user_id){
    
    socket.io.opts.query = {
        latitude,
        longitude,
        searchBusLines,
        user_id,
    };

    socket.connect();
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
    }
}


export {
    connect,
    disconnect,
    subscribeToUpdatedBusLineLocations,
};