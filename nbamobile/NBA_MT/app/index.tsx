import './gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playersearch from './Pages/playerSearch';
import Signup from './Pages/signup';
import { AuthProvider, useAuth } from './Auth/auth';
import Nav from './nav';

const Drawer = createDrawerNavigator();


export default function Index() {
  return (
    <AuthProvider>
      <Nav/>
    </AuthProvider>
  );
}