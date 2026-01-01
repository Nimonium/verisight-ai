/**
 * Authentication Screen
 * PIN entry and biometric unlock
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

const PIN_LENGTH = 6;

export default function AuthScreen() {
  const { authenticate, pin } = useAuth();
  const [inputPin, setInputPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinInput = (digit: string) => {
    if (inputPin.length < PIN_LENGTH) {
      const newPin = inputPin + digit;
      setInputPin(newPin);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Auto-submit when PIN is complete
      if (newPin.length === PIN_LENGTH) {
        handleAuthenticate(newPin);
      }
    }
  };

  const handleBackspace = () => {
    if (inputPin.length > 0) {
      setInputPin(inputPin.slice(0, -1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleAuthenticate = async (pinToAuth: string) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await authenticate(pinToAuth);
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
      } else {
        setError('Invalid PIN');
        setInputPin('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err) {
      setError('Authentication failed');
      setInputPin('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputPin('');
    setError('');
  };

  return (
    <ScreenContainer containerClassName="bg-black" className="flex-1 justify-center items-center p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="items-center gap-8">
          {/* Logo / Title */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-green-500">VERISIGHT-AI</Text>
            <Text className="text-sm text-gray-400">SECURE ENVIRONMENT</Text>
          </View>

          {/* Authentication Status */}
          <View className="items-center gap-1">
            <Text className="text-lg text-gray-300">AUTHENTICATE</Text>
            <Text className="text-xs text-gray-500">Enter credentials to access</Text>
          </View>

          {/* PIN Display */}
          <View className="flex-row gap-2 justify-center">
            {Array(PIN_LENGTH)
              .fill(null)
              .map((_, i) => (
                <View
                  key={i}
                  className={`w-12 h-12 rounded-lg border-2 items-center justify-center ${
                    i < inputPin.length
                      ? 'bg-green-500 border-green-500'
                      : 'bg-gray-900 border-gray-700'
                  }`}
                >
                  {i < inputPin.length && <Text className="text-xl font-bold text-black">•</Text>}
                </View>
              ))}
          </View>

          {/* Error Message */}
          {error && <Text className="text-red-500 text-sm text-center">{error}</Text>}

          {/* Numeric Keypad */}
          <View className="w-full max-w-xs gap-3">
            {/* Row 1 */}
            <View className="flex-row gap-3 justify-center">
              {[1, 2, 3].map(num => (
                <PinButton key={num} digit={num.toString()} onPress={handlePinInput} />
              ))}
            </View>

            {/* Row 2 */}
            <View className="flex-row gap-3 justify-center">
              {[4, 5, 6].map(num => (
                <PinButton key={num} digit={num.toString()} onPress={handlePinInput} />
              ))}
            </View>

            {/* Row 3 */}
            <View className="flex-row gap-3 justify-center">
              {[7, 8, 9].map(num => (
                <PinButton key={num} digit={num.toString()} onPress={handlePinInput} />
              ))}
            </View>

            {/* Row 4 */}
            <View className="flex-row gap-3 justify-center">
              <PinButton digit="0" onPress={handlePinInput} />
              <Pressable
                onPress={handleBackspace}
                disabled={inputPin.length === 0 || isLoading}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 64,
                  borderRadius: 8,
                  backgroundColor: '#111827',
                  borderWidth: 1,
                  borderColor: '#374151',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: inputPin.length === 0 || isLoading ? 0.5 : pressed ? 0.7 : 1,
                })}
              >
                <Text className="text-gray-400 text-xl font-bold">←</Text>
              </Pressable>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="w-full gap-2">
            <Pressable
              onPress={() => handleAuthenticate(inputPin)}
              disabled={inputPin.length !== PIN_LENGTH || isLoading}
              style={({ pressed }) => ({
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: inputPin.length === PIN_LENGTH && !isLoading ? '#22c55e' : '#374151',
                transform: pressed && inputPin.length === PIN_LENGTH && !isLoading ? [{ scale: 0.97 }] : [{ scale: 1 }],
              })}
            >
              <Text
                className={`font-bold text-lg ${
                  inputPin.length === PIN_LENGTH && !isLoading ? 'text-black' : 'text-gray-500'
                }`}
              >
                AUTHENTICATE
              </Text>
            </Pressable>

            {inputPin.length > 0 && (
              <Pressable
                onPress={handleClear}
                disabled={isLoading}
                style={({ pressed }) => ({
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#374151',
                  opacity: pressed && !isLoading ? 0.7 : 1,
                })}
              >
                <Text className="text-gray-400 font-semibold">CLEAR</Text>
              </Pressable>
            )}
          </View>

          {/* Footer */}
          <Text className="text-xs text-gray-600 text-center mt-4">
            VERISIGHT-AI v1.0 • OFFLINE MODE • ENCRYPTED
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface PinButtonProps {
  digit: string;
  onPress: (digit: string) => void;
}

function PinButton({ digit, onPress }: PinButtonProps) {
  return (
    <Pressable
      onPress={() => onPress(digit)}
      style={({ pressed }) => ({
        flex: 1,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#111827',
        borderWidth: 1,
        borderColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
        transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text className="text-green-500 text-2xl font-bold">{digit}</Text>
    </Pressable>
  );
}
