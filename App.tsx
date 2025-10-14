import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/types';
import { LoginScreen } from './src/screens/LoginScreen';
import { UserListScreen } from './src/screens/UserListScreen';
import { UserFormScreen } from './src/screens/UserFormScreen';
 

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="UserList" component={UserListScreen} />
          <Stack.Screen name="UserForm" component={UserFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
