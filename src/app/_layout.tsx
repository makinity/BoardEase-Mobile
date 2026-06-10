import '@/global.css';

import { Stack } from 'expo-router';

import { AppProviders } from '@/providers';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(occupant)" />
        <Stack.Screen name="(owner)" />
        <Stack.Screen name="(shared)" options={{ presentation: 'modal' }} />
      </Stack>
    </AppProviders>
  );
}
