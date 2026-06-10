import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

type CardShellProps = PropsWithChildren<{
  tone?: 'default' | 'accent';
}>;

export function CardShell({ children, tone = 'default' }: CardShellProps) {
  return <View style={[styles.card, tone === 'accent' && styles.accent]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 8,
    shadowColor: '#102A43',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  accent: {
    borderLeftWidth: 4,
    borderLeftColor: '#208AEF',
  },
});
