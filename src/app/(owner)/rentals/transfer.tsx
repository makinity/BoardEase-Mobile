import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function TransferRental() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Transfer Rental: {id}</Text>
    </View>
  );
}
