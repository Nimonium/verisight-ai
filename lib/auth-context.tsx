/**
 * Authentication Context
 * Manages PIN authentication and biometric unlock
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  isAuthenticated: boolean;
  pin: string | null;
  authenticate: (pin: string) => Promise<boolean>;
  setupPin: (pin: string) => Promise<void>;
  logout: () => Promise<void>;
  isBiometricAvailable: boolean;
  useBiometric: boolean;
  setBiometric: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [useBiometric, setUseBiometricState] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if PIN is set
      const storedPin = await SecureStore.getItemAsync('verisight_pin');
      if (storedPin) {
        setPin(storedPin);
      }

      // Check if biometric is enabled
      const biometricEnabled = await SecureStore.getItemAsync('verisight_biometric_enabled');
      if (biometricEnabled === 'true') {
        setUseBiometricState(true);
      }

      // For now, assume biometric is available (in production: check device capabilities)
      setIsBiometricAvailable(true);
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  };

  const authenticate = async (inputPin: string): Promise<boolean> => {
    try {
      if (!pin) {
        // First time setup
        await setupPin(inputPin);
        setIsAuthenticated(true);
        return true;
      }

      // Verify PIN
      if (inputPin === pin) {
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  const setupPin = async (newPin: string) => {
    try {
      await SecureStore.setItemAsync('verisight_pin', newPin);
      setPin(newPin);
    } catch (error) {
      console.error('PIN setup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
  };

  const setBiometric = async (enabled: boolean) => {
    try {
      await SecureStore.setItemAsync('verisight_biometric_enabled', enabled ? 'true' : 'false');
      setUseBiometricState(enabled);
    } catch (error) {
      console.error('Biometric setting failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        pin,
        authenticate,
        setupPin,
        logout,
        isBiometricAvailable,
        useBiometric,
        setBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
