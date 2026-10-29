import { NavigatorScreenParams } from '@react-navigation/native';
import { Transaction } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budget: undefined;
  Goals: undefined;
  Insights: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  Profile: undefined;
  Bills: undefined;
  Reports: undefined;
  AddTransaction: { type?: 'income' | 'expense'; transaction?: Transaction };
  TransactionDetail: { transaction: Transaction };
  Notifications: undefined;
  EditProfile: undefined;
  CreateBudget: undefined;
  CreateGoal: undefined;
  AddBill: undefined;
};
