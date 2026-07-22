import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { TransactionsScreen } from '../screens/main/TransactionsScreen';
import { BudgetScreen } from '../screens/main/BudgetScreen';
import { GoalsScreen } from '../screens/main/GoalsScreen';
import { InsightsScreen } from '../screens/main/InsightsScreen';
import { colors } from '../theme/colors';
import { AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

const tabIcons: Record<keyof AppTabParamList, string> = {
  Home: '🏠',
  Transactions: '💳',
  Budget: '📊',
  Goals: '🎯',
  Insights: '✨',
};

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={[styles.icon, focused && styles.iconActive]}>
            {tabIcons[route.name]}
          </Text>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}>
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    height: 60,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
});
