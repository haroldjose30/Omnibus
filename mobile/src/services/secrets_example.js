import {Platform} from 'react-native';

export default class Secrets {
  static API_URL = (Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://192.168.100.106:3333') 
  static FIXED_ACCESS_TOKEN = '' 
}