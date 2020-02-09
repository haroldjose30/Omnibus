import React from 'react';
import { StatusBar, YellowBox} from 'react-native'
import Routes from './src/routes'
import taskManager from './src/services/taskManager'


YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);



export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="yellow"/>
      <Routes/>
    </>
  );
}
