import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

export default function RequireSubscription({ children }) {
  const { user, initializing } = useAuth();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  if (initializing) {
    return (
      <div
        data-testid="auth-loading"
        className="min-h-screen grid place-items-center bg-white"
      >
        <p className="cc-label">Loading session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/login" replace state={{ from: location }} />
    );
  }

  if (subscriptionLoading) {
    return (
      <div
        data-testid="subscription-loading"
        className="min-h-screen grid place-items-center bg-white"
      >
        <p className="cc-label">Checking subscription…</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <Navigate to="/pricing" replace state={{ reason: "paywall" }} />
    );
  }

  return (
    <div data-testid="subscription-gate">
      {children}
    </div>
  );
}
