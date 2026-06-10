import { Text } from 'react-native';

import { CardShell } from './CardShell';

export type PaymentCardProps = {
  title: string;
  amount?: string;
};

export function PaymentCard({ amount, title }: PaymentCardProps) {
  return (
    <CardShell tone="accent">
      <Text>{title}</Text>
      {amount ? <Text>{amount}</Text> : null}
    </CardShell>
  );
}
