import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ReportsScreen from './screens/ReportsScreen';

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
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      
      >
        <Tab.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
        <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
