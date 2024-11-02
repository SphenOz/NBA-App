import './gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playersearch from './Pages/playerSearch';
import Signup from './Pages/signup';
import { AuthProvider, useAuth } from './Auth/auth';
import Nav, { AuthStack } from './nav';
import {useEffect} from 'react';
import { axiosInterceptor } from './Auth/authInterceptor';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();


export default function Index() {
  return (
    <AuthProvider>
      <Nav/>
    </AuthProvider>
  );
}