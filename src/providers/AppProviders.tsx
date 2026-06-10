import { PropsWithChildren } from 'react';

import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </AuthProvider>
  );
}

export default AppProviders;
