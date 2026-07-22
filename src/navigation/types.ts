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
  MainTabs: undefined;
  Profile: undefined;
  Bills: undefined;
  Reports: undefined;
  AddTransaction: { type?: 'income' | 'expense' };
  CreateBudget: undefined;
  CreateGoal: undefined;
  AddBill: undefined;
};
