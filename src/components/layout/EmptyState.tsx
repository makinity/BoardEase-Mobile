import { StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#102A43',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#627D98',
    textAlign: 'center',
  },
});
