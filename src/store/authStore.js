import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [], 
      currentUser: null,

      // Register Function
      register: (userData) => {
        const { users } = get();r
        const isEmailExist = users.some((u) => u.email === userData.email);
        
        if (isEmailExist) {
          return { success: false, message: 'Email sudah terdaftar!' };
        }

        const newUser = { ...userData, id: Date.now().toString() };
        set({ users: [...users, newUser] });
        return { success: true, message: 'Registrasi berhasil! Silakan login.' };
      },

      // Login Function
      login: (email, password) => {
        const { users } = get();
        const user = users.find((u) => u.email === email && u.password === password);

        if (user) {
          set({ currentUser: user });
          return { success: true, message: 'Login berhasil!', role: user.role };
        }

        return { success: false, message: 'Email atau password salah!' };
      },

      // Logout Function
      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: 'exkul-auth-storage',
    }
  )
);