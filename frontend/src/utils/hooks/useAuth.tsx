import { useState, useCallback } from "react";
import { User } from "../types/types";

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
  });

  const login = useCallback((user: User, token: string) => {
    setAuthState({ user, token });
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null });
  }, []);

  return {
    user: authState.user,
    token: authState.token,
    login,
    logout,
  };
};
