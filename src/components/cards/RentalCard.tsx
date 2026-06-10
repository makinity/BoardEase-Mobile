import { Text } from 'react-native';

import { CardShell } from './CardShell';

export type RentalCardProps = {
  title: string;
  balance?: string;
};

export function RentalCard({ balance, title }: RentalCardProps) {
  return (
    <CardShell>
      <Text>{title}</Text>
      {balance ? <Text>{balance}</Text> : null}
    </CardShell>
  );
}
