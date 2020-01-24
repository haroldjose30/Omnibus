import socketio from 'socket.io-client'
const token = 'token'
const cookie = 'cookie'
const socket = socketio('http://localhost:3333',{
    //timeout: 10000,
    //jsonp: false,
    //transports: ['websocket'],
    autoConnect: false,
    //agent: '-',
    //path: '/realtime', // Whatever your path is
    //pfx: '-',
    //key: token, // Using token-based auth.
    //passphrase: cookie, // Using cookie auth.
    //cert: '-',
    //ca: '-',
    //ciphers: '-',
    //rejectUnauthorized: '-',
    //perMessageDeflate: '-'
  });

const socket_event = 'Updated-BusLineLocations'
function subscribeToUpdatedBusLineLocations(subscribeFunction) {
   
    socket.removeAllListeners()
    socket.on(socket_event,subscribeFunction)
    // if (!socket.hasListeners(socket_event)) {
    //     socket.on(socket_event,subscribeFunction)
    // }
}


function connect(latitude,longitude,searchBusLineCode,searchBusLineName,user_id){
    
    socket.io.opts.query = {
        latitude,
        longitude,
        searchBusLineCode,
        searchBusLineName,
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