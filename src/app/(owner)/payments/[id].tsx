import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function PaymentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Payment Detail: {id}</Text>
    </View>
  );
}
