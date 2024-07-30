import './gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playersearch from './playerSearch';
import Signup from './signup';
import { AuthProvider } from './Auth/auth';

const Drawer = createDrawerNavigator();

export default function Index() {
  return (
    <AuthProvider>
      <Drawer.Navigator>
        <Drawer.Screen name="PlayerSearch" component={Playersearch} />
        <Drawer.Screen name="Signup" component={Signup}/>
      </Drawer.Navigator>
    </AuthProvider>
  );
}