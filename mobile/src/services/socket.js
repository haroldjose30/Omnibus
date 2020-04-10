import socketio from 'socket.io-client'
import Secrets  from './secrets_real'

const token = 'token'
const cookie = 'cookie'
//todo: harold - protect socket
const socket = socketio(Secrets.API_URL,{
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

function subscribeToEvent(socketEventName,callBackFunction) {
   
    socket.removeAllListeners()
    socket.on(socketEventName,callBackFunction)
    // if (!socket.hasListeners(socketEventName)) {
    //     socket.on(socketEventName,callBackFunction)
    // }
}


function connect(latitude,longitude,searchBusLineCode,searchBusLineName,user_id){
    console.log('user connecting to socket',user_id);
    
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
    subscribeToEvent,
};