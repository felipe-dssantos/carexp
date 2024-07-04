import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ReportsScreen from './screens/ReportsScreen';
import HistoryScreen from './screens/HistoryScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'AddExpense') {
              iconName = 'add-circle-outline';
            } else if (route.name === 'Reports') {
              iconName = 'analytics-outline';
            }else if (route.name === 'History'){
              iconName = 'calendar'
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      
      >
        <Tab.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense ',
        headerTintColor: '#fff',
          headerStyle: {
            backgroundColor : '#00A86B'
          }
         }} />
         <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor : '#00A86B'
          } }} />
        <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor : '#00A86B'
          },
         }} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
