import PocketBase from 'pocketbase';
import { LocalAuthStore } from 'pocketbase';

// Create a local auth store that persists to localStorage
const authStore = new LocalAuthStore('pb_auth');

const pb = new PocketBase('https://taken-hold.pockethost.io', authStore);

export const authService = {
  login: async (credentials) => {
    const authData = await pb.collection('users').authWithPassword(
        credentials.username,
        credentials.password,
    );
    return authData;
  },
  logout: async () => {
    pb.authStore.clear();
  },
  checkStatus: () => {
    const isValid = pb.authStore.isValid;
    const user = pb.authStore.model;
    return {
      isAuthenticated: isValid,
      user: user ? { id: user.id, username: user.username } : null,
    };
  },
  getToken: () => pb.authStore.token,
};
export default {
  auth: authService,
};
