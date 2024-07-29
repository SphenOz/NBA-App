import './gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playersearch from './playerSearch';
import Signup from './signup';

const Drawer = createDrawerNavigator();

export default function Index() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="PlayerSearch" component={Playersearch} />
      <Drawer.Screen name="Signup" component={Signup}/>
    </Drawer.Navigator>
  );
}