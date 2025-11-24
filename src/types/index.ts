export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgetPass: undefined;
  ShopList: undefined;
  Shop: { shopId: string } | undefined;
  Payment: { amount?: number; items?: Array<any> } | undefined;
  Product: { product?: { id: string; title: string; price: string; image: string } } | undefined;
  Ticket: { id: string; qrValue: string; amount: number } | undefined;
  // allow passing an initial tab to Main stack
  Main: { screen?: keyof TabParamList } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Cart: undefined;
  Voice: undefined;
  Voucher: undefined;
  Profile: { open?: 'achievements' | 'voice' | 'both' } | undefined;
};
