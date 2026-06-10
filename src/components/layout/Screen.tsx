import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { PageHeader } from './PageHeader';

type ScreenProps = PropsWithChildren<{
  title: string;
  description?: string;
  scrollable?: boolean;
}>;

export function Screen({ children, description, scrollable = true, title }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <PageHeader title={title} description={description} />
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <PageHeader title={title} description={description} />
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    gap: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});

export default Screen;
