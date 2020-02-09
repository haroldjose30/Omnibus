import axios from 'axios';
import Global  from '../utils/global'

const Api = axios.create({
    baseURL: Global.API_URL, 
});

export default Api