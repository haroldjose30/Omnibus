import {Platform} from 'react-native';

export default class Global {
  static API_URL = (Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://192.168.100.106:3333')  
}