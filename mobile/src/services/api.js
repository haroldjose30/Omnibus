import axios from 'axios';
import Secrets from './secrets_real'

const Api = axios.create({
    baseURL: Secrets.API_URL,
    headers: {
        common: {
          'x-access-token': Secrets.FIXED_ACCESS_TOKEN
        }
      }
});

export default Api