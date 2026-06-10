import { Text } from 'react-native';

import { CardShell } from './CardShell';

export type CollectableCardProps = {
  title: string;
  amount?: string;
};

export function CollectableCard({ amount, title }: CollectableCardProps) {
  return (
    <CardShell>
      <Text>{title}</Text>
      {amount ? <Text>{amount}</Text> : null}
    </CardShell>
  );
}
