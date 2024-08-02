import './gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playersearch from './Pages/playerSearch';
import Signup from './Pages/signup';
import { AuthProvider, useAuth } from './Auth/auth';
import { View, Text } from 'react-native';
import TeamSelect from './Pages/teamSelect';
import Home from './Pages/Home';

const Drawer = createDrawerNavigator();


export default function Nav() {
    const {isLoggedIn} = useAuth()
  return (
    <>
        <Drawer.Navigator>
            <Drawer.Screen name="PlayerSearch" component={Playersearch} />
            {isLoggedIn ? 
            <>
            <Drawer.Screen name="TeamSelect" component={TeamSelect}/>
            <Drawer.Screen name="Home" component={Home}/>
            </>
            : 
            <Drawer.Screen name="Signup" component={Signup}/>}
        </Drawer.Navigator>
    </>
  );
}