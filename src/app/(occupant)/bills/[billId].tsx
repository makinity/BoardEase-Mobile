import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function BillDetail() {
  const { billId } = useLocalSearchParams<{ billId: string }>();
  return (
    <View>
      <Text>Bill Detail: {billId}</Text>
    </View>
  );
}
