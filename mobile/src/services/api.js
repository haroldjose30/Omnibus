import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://localhost:3333'
    //baseURL: 'http://192.168.100.106:3333'
});

export default Api