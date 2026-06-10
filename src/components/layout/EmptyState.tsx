import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
};

export function EmptyState({ description, onRetry, title }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 24,
    gap: 8,
    margin: 16,
  },
  title: { fontSize: 16, fontWeight: '600', color: '#102A43', textAlign: 'center' },
  description: { fontSize: 14, lineHeight: 20, color: '#627D98', textAlign: 'center' },
  retryButton: { marginTop: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#3182CE', borderRadius: 8 },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
