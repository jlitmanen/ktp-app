import PocketBase from 'pocketbase';

const pb = new PocketBase('https://taken-hold.pockethost.io');

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
  checkStatus: () => pb.authStore.isValid,
};
export default {
  auth: authService,
};
