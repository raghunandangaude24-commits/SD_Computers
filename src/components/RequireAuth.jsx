import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../store/StoreContext.jsx";
import PageState from "./PageState.jsx";

/**
 * Wraps a protected page. While the stored session is still being
 * re-validated we show a loading state (no redirect flash), then either
 * render the page or bounce to /login remembering where the user came
 * from so login can return them.
 */
export default function RequireAuth({ children }) {
  const { user, authReady } = useStore();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="page-state-wrap">
        <PageState variant="loading" title="Loading your account..." />
      </div>
    );
  }

  if (!user) {
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