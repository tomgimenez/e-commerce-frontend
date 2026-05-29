import type { Role, User } from '@/interfaces/user.interface';
import { create } from 'zustand';
import { loginAction } from '../actions/login.action';
import { checkStatusAction } from '../actions/check-status.action';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

export type AuthState = {
  //  Properties
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;

  // Getters
  isAdmin: () => boolean;

  // Actions
  login: (email:string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  authStatus: 'checking',

  isAdmin: () => {
    const roles = get().user?.roles || [];
    
    return roles.some((role: Role) => (role.name === 'admin'))
  },

  login: async (email: string, password: string) => {

    try {
      const data = await loginAction(email, password);
      localStorage.setItem('token', data.token);

      set({ user: data.user, token: data.token, authStatus: 'authenticated' });
      
      return true;

    } catch {
      set({ user: null, token: null, authStatus: 'not-authenticated' });
      localStorage.removeItem('token');

      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({user: null, token: null, authStatus: 'not-authenticated'})
  },

  checkAuthStatus: async () => {
    try {
      const {user, token} = await checkStatusAction();

      set({
        user: user,
        token: token,
        authStatus: 'authenticated'
      });

      return true;
    } catch {
      set({
        user: null,
        token: null,
        authStatus: 'not-authenticated'
      });

      return false;
    }
  }
}));