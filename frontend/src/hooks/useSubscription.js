import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/auth/AuthContext";

const DEFAULT_STATE = {
  isSubscribed: false,
  plan: "free",
  status: "inactive",
  loading: false,
  error: null,
};

export function useSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState({ ...DEFAULT_STATE, loading: !!user });

  useEffect(() => {
    if (!user) {
      setState(DEFAULT_STATE);
      return;
    }

    let mounted = true;

    (async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from("konstru_subscriptions")
        .select("plan, status, expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setState({
          isSubscribed: false,
          plan: "free",
          status: "inactive",
          loading: false,
          error,
        });
        return;
      }

      if (!data) {
        setState({
          isSubscribed: false,
          plan: "free",
          status: "inactive",
          loading: false,
          error: null,
        });
        return;
      }

      const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
      const isActive =
        data.status === "active" &&
        (expiresAt === null || expiresAt > new Date());

      setState({
        isSubscribed: isActive,
        plan: data.plan ?? "free",
        status: data.status ?? "inactive",
        loading: false,
        error: null,
      });
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  return state;
}
