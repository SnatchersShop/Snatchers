import CognitoAuthProvider, { useCognitoAuth } from './CognitoAuth';

// Re-export provider under the original name to avoid changing imports across the app
export const AuthProvider = CognitoAuthProvider;

// keep the same hook name used throughout the codebase
export function useAuth() {
  return useCognitoAuth();
}
