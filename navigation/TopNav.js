
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StatusBar , Text} from "react-native";
import Active from "../screen/Active";
import Pending from "../screen/Pending";
import Cancelled from "../screen/Cancelled";

const TopNavigator = createMaterialTopTabNavigator();

export default function TopNav() {
  const statusBarHeight = StatusBar.currentHeight || 0; // StatusBar yüksekliği

  return (
    <TopNavigator.Navigator screenOptions={{}}>
        <Text>sadıkkkk</Text>
      <TopNavigator.Screen name="active" component={Active} />
      <TopNavigator.Screen name="pending" component={Pending} />
      <TopNavigator.Screen name="cancelled" component={Cancelled} />
    </TopNavigator.Navigator>
  );
}
