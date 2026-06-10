import { Text } from 'react-native';

import { CardShell } from './CardShell';

export type RoomCardProps = {
  title: string;
  status?: string;
};

export function RoomCard({ status, title }: RoomCardProps) {
  return (
    <CardShell>
      <Text>{title}</Text>
      {status ? <Text>{status}</Text> : null}
    </CardShell>
  );
}
