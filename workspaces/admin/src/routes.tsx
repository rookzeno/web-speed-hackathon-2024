import { createRootRoute, createRoute, createRouter, lazyRouteComponent, redirect } from '@tanstack/react-router';

import { authApiClient } from './features/auth/apiClient/authApiClient';
import { CommonLayout } from './foundation/layouts/CommonLayout';
import { queryClient } from './lib/api/queryClient';
import { AuthPage } from './pages/AuthPage';

async function authGuard(): Promise<void> {
  const user = await queryClient.fetchQuery({
    queryFn: async () => {
      try {
        const user = await authApiClient.fetchAuthUser();
        return user;
      } catch (_err) {
        return null;
      }
    },
    queryKey: authApiClient.fetchAuthUser$$key(),
  });

  if (user == null) {
    throw redirect({
      to: `/admin`,
    });
  }
}

const rootRoute = createRootRoute({
  component: CommonLayout,
});

const authRoute = createRoute({
  component: AuthPage,
  getParentRoute: () => rootRoute,
  path: `/admin`,
});

const authorListRoute = createRoute({
  beforeLoad: authGuard,
  component: lazyRouteComponent(() => import('./pages/AuthorListPage').then((m) => ({ default: m.AuthorListPage }))),
  getParentRoute: () => rootRoute,
  path: `/admin/authors`,
});

const bookListRoute = createRoute({
  beforeLoad: authGuard,
  component: lazyRouteComponent(() => import('./pages/BookListPage').then((m) => ({ default: m.BookListPage }))),
  getParentRoute: () => rootRoute,
  path: `/admin/books`,
});

export const episodeDetailRoute = createRoute({
  beforeLoad: authGuard,
  component: lazyRouteComponent(() =>
    import('./pages/EpisodeDetailPage').then((m) => ({ default: m.EpisodeDetailPage })),
  ),
  getParentRoute: () => rootRoute,
  path: `/admin/books/$bookId/episodes/$episodeId`,
});

export const episodeCreateRoute = createRoute({
  beforeLoad: authGuard,
  component: lazyRouteComponent(() =>
    import('./pages/EpisodeCreatePage').then((m) => ({ default: m.EpisodeCreatePage })),
  ),
  getParentRoute: () => rootRoute,
  path: `/admin/books/$bookId/episodes/new`,
});

const routeTree = rootRoute.addChildren([
  authRoute,
  authorListRoute,
  bookListRoute,
  episodeDetailRoute,
  episodeCreateRoute,
]);

export const router = () => {
  return createRouter({ routeTree });
};
