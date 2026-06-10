import { Redirect } from 'expo-router';

// /income merged into /payments per user-owner.md "Payments & Income"
export default function IncomeRedirect() {
  return <Redirect href="/(owner)/payments" />;
}
