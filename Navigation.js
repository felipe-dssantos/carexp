import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import InsertExpenseScreen from './screens/InsertExpenseScreen';
import InsertEarningScreen from './screens/InsertEarningScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import HomeScreen from './screens/HomeScreen'; // Adicionado

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="InsertExpense" component={InsertExpenseScreen} options={{ title: 'Inserir Gastos' }} />
        <Stack.Screen name="InsertEarning" component={InsertEarningScreen} options={{ title: 'Inserir Ganhos' }} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Extrato' }} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}
