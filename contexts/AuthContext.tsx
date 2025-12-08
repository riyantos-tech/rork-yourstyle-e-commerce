import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { User } from '@/types/product';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook((): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeAdmin();
    loadUser();
  }, []);

  const initializeAdmin = async () => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];
      
      const adminExists = users.find(u => u.email === 'admin@yourstyle.com');
      
      if (!adminExists) {
        const adminUser: User & { password: string } = {
          id: 'admin-001',
          name: 'Admin',
          email: 'admin@yourstyle.com',
          password: 'admin123',
          role: 'admin',
        };
        users.push(adminUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));
        console.log('Admin account created');
      }
    } catch (error) {
      console.error('Failed to initialize admin:', error);
    }
  };

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];
      
      const existingUser = users.find(u => u.email === email && u.password === password);
      
      if (existingUser) {
        const { password: _, ...userWithoutPassword } = existingUser;
        setUser(userWithoutPassword);
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];
      
      if (users.find(u => u.email === email)) {
        return false;
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: 'user',
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      const usersData = await AsyncStorage.getItem('users');
      const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return { user, isLoading, login, register, logout, updateProfile };
});
