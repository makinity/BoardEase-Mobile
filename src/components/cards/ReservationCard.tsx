import { Text } from 'react-native';

import { CardShell } from './CardShell';

export type ReservationCardProps = {
  title: string;
  status?: string;
};

export function ReservationCard({ status, title }: ReservationCardProps) {
  return (
    <CardShell tone="accent">
      <Text>{title}</Text>
      {status ? <Text>{status}</Text> : null}
    </CardShell>
  );
}
