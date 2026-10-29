import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigator } from './AppNavigator';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { BillsScreen } from '../screens/main/BillsScreen';
import { ReportsScreen } from '../screens/main/ReportsScreen';
import { AddTransactionScreen } from '../screens/forms/AddTransactionScreen';
import { CreateBudgetScreen } from '../screens/forms/CreateBudgetScreen';
import { CreateGoalScreen } from '../screens/forms/CreateGoalScreen';
import { AddBillScreen } from '../screens/forms/AddBillScreen';
import { TransactionDetailScreen } from '../screens/main/TransactionDetailScreen';
import { NotificationsScreen } from '../screens/main/NotificationsScreen';
import { EditProfileScreen } from '../screens/main/EditProfileScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  onLogout: () => void;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppNavigator} />
      <Stack.Screen name="Profile">
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Bills" component={BillsScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} />
      <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
      <Stack.Screen name="AddBill" component={AddBillScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};
