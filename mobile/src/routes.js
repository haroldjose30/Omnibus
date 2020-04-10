import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import ShareLocation from './pages/ShareLocation';



const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                title: 'Omnibus'
            },
        }, 
        ShareLocation: {
            screen: ShareLocation,
            navigationOptions: {
                title: 'Omnibus'
            },
        }, 
    },{
        //aplicado a todas as paginas e nav4egacoes
        defaultNavigationOptions: {
            headerTintColor : 'black',
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: '#ecb911'
            }
        }
    }
    )
);

export default Routes;