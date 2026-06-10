import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function EndRental() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>End Rental: {id}</Text>
    </View>
  );
}
