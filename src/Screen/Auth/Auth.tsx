import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

export type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
  };
  
export const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const Auth = (_props: NativeStackScreenProps<RootStackParamList, 'Auth'>) => {
    // Stack Navigator for Login and Sign up Screen
    return (
      <AuthStack.Navigator initialRouteName="LoginScreen">
        <AuthStack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{
            title: 'Register', //Set Header Title
            headerStyle: {
              backgroundColor: '#307ecc', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
      </AuthStack.Navigator>
    );
  };
  
export default Auth;
