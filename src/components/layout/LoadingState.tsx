import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#208AEF" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  label: {
    fontSize: 14,
    color: '#52606D',
  },
});
