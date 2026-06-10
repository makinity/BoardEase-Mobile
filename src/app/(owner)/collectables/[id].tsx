import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function CollectableDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Collectable Detail: {id}</Text>
    </View>
  );
}
