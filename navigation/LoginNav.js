
import React from 'react'
import Login from '../screen/Login'
import Register from '../screen/Register'
import { createStackNavigator } from '@react-navigation/stack'

const LoginNav = () => {
    const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
  )
}

export default LoginNav


