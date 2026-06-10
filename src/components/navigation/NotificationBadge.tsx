import { StyleSheet, Text, View } from 'react-native';

type NotificationBadgeProps = { count: number };

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#E53E3E',
    borderRadius: 9999,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});
