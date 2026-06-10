import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ReceiptDetail() {
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();
  return (
    <View>
      <Text>Receipt: {receiptId}</Text>
    </View>
  );
}
