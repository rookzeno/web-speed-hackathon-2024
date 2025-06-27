import { useSuspenseQuery } from '@tanstack/react-query';

import { authApiClient } from '../apiClient/authApiClient';

export function useAuthUser() {
  return useSuspenseQuery({
    // 5 minutes
    gcTime: 10 * 60 * 1000,
    queryFn: async () => {
      try {
        const user = await authApiClient.fetchAuthUser();
        return user;
      } catch (_err) {
        return null;
      }
    },
    queryKey: authApiClient.fetchAuthUser$$key(),
    staleTime: 5 * 60 * 1000, // 10 minutes
  });
}
