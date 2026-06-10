import { Text } from 'react-native';

import { CardShell } from './CardShell';

export type PropertyCardProps = {
  name: string;
  location?: string;
};

export function PropertyCard({ location, name }: PropertyCardProps) {
  return (
    <CardShell>
      <Text>{name}</Text>
      {location ? <Text>{location}</Text> : null}
    </CardShell>
  );
}
