import { StyleSheet, Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
};

export function SectionHeader({ actionLabel, title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#102A43',
  },
  action: {
    fontSize: 13,
    color: '#486581',
  },
});
