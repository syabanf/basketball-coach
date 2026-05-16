import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.js';

/**
 * Wrap protected routes with this component. Redirects unauthenticated users
 * to /login, preserving the original target in location.state.from so the
 * login flow can bounce them back.
 */
export function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return children;
}
