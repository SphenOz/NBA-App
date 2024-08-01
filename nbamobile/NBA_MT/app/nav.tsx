import './gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playersearch from './playerSearch';
import Signup from './signup';
import { AuthProvider, useAuth } from './Auth/auth';
import { View, Text } from 'react-native';
import Home from './Home';

const Drawer = createDrawerNavigator();


export default function Nav() {
    const {isLoggedIn} = useAuth()
  return (
    <>
        <Drawer.Navigator>
            <Drawer.Screen name="PlayerSearch" component={Playersearch} />
            {isLoggedIn ? 
            <Drawer.Screen name="Home" component={Home}/>
            : 
            <Drawer.Screen name="Signup" component={Signup}/>}
        </Drawer.Navigator>
    </>
  );
}