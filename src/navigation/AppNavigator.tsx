import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { TransactionsScreen } from '../screens/main/TransactionsScreen';
import { BudgetScreen } from '../screens/main/BudgetScreen';
import { GoalsScreen } from '../screens/main/GoalsScreen';
import { InsightsScreen } from '../screens/main/InsightsScreen';
import { colors } from '../theme/colors';
import { Icon, IconName } from '../components/Icon';
import { AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

const tabIcons: Record<keyof AppTabParamList, IconName> = {
  Home: 'home',
  Transactions: 'card',
  Budget: 'chart',
  Goals: 'target',
  Insights: 'spark',
};

export const AppNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Icon
            name={tabIcons[route.name]}
            size={22}
            color={focused ? colors.primary : colors.textLight}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 56 + bottomPad,
            paddingBottom: bottomPad,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarLabel: ({ focused, color }) => (
          <Text style={[styles.tabLabel, { color, fontWeight: focused ? '600' : '500' }]}>
            {route.name === 'Home' ? 'Home' : route.name}
          </Text>
        ),
      })}>
      <Tab.Screen name="Home" component={DashboardScreen} />
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    elevation: 0,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
    }),
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.1,
    marginTop: 2,
  },
});
