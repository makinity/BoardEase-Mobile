import { StyleSheet, Text, View } from 'react-native';

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ description, title }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#102A43',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#52606D',
  },
});
