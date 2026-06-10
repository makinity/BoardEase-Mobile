import { Text } from 'react-native';

import { CardShell } from './CardShell';

export type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <CardShell>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </CardShell>
  );
}
