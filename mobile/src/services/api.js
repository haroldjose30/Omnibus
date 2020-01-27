import {Platform} from 'react-native';
import axios from 'axios';

const Api = axios.create({
    baseURL: Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://192.168.100.106:3333', 
});

export default Api