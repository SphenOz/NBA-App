import './gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playersearch from './Pages/playerSearch';
import Signup from './Pages/signup';
import { AuthProvider, isTokenExpired, useAuth } from './Auth/auth';
import { View, Text } from 'react-native';
import TeamSelect from './Pages/teamSelect';
import Home from './Pages/Home';
import GameView from './Pages/GameView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { axiosInterceptor } from './Auth/authInterceptor';
import { NavigationContainer } from '@react-navigation/native';
const Drawer = createDrawerNavigator();


export function DrawerNav() {
    const {isLoggedIn} = useAuth()
  return (
    <>
        <Drawer.Navigator>
            <Drawer.Screen name="PlayerSearch" component={Playersearch} />
            {isLoggedIn ? 
            <>
            <Drawer.Screen name="TeamSelect" component={TeamSelect}/>
            <Drawer.Screen name="Home" component={Home}/>
            <Drawer.Screen name="Games" component={GameView}/>
            </>
            : 
            <Drawer.Screen name="Signup" component={Signup}/>}
        </Drawer.Navigator>
    </>
  );
}
// AuthStack.js


const Stack = createNativeStackNavigator();

export function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
    );
}

export default function Nav() {
  const {logout, isLoggedIn, token} = useAuth();
  useEffect(() => {
    axiosInterceptor(logout);
  }, [logout])

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("User is logged out")
    }
  }, [isLoggedIn]);

  useEffect(() => {
    tokencheck()
  }, [])

  const tokencheck = async() => {
    if(token){
      if (await isTokenExpired(token)){
        logout()
      }
    }
    else
      console.log("token not expired")
  }
  return(
    <>
      {isLoggedIn ? <DrawerNav/> : <AuthStack/>}
    </>
  )
}