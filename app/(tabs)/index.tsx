/**
 * Mission Dashboard / Home Screen
 * Main interface for VERISIGHT-AI
 */

import React, { useEffect } from 'react';
import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAnalysis } from '@/lib/analysis-context';
import { useAuth } from '@/lib/auth-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { analysisHistory, currentAnalysis } = useAnalysis();
  const { logout } = useAuth();

  const handleInitializeScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('../capture');
  };

  const handleAnalyzeFootage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('../capture');
  };

  const handleAnalyzeAudio = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('../capture');
  };

  const handleViewResult = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`../result/${id}`);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('../../auth');
  };

  return (
    <ScreenContainer containerClassName="bg-black" className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between pt-2">
            <View>
              <Text className="text-2xl font-bold text-green-500">VERISIGHT-AI</Text>
              <Text className="text-xs text-gray-500">MISSION CONTROL</Text>
            </View>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({
                padding: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text className="text-gray-400 text-sm">⚙️</Text>
            </Pressable>
          </View>

          {/* Status Indicator */}
          <View className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 rounded-full bg-green-500" />
              <Text className="text-green-500 text-xs font-bold">SYSTEM ACTIVE</Text>
            </View>
            <Text className="text-gray-400 text-xs leading-relaxed">
              Offline-first detection ready. All models loaded. Secure environment initialized.
            </Text>
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-gray-400 text-xs font-bold">QUICK ACTIONS</Text>

            <Pressable
              onPress={handleInitializeScan}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#16a34a' : '#22c55e',
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
                transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
              })}
            >
              <Text className="text-black font-bold text-lg">INITIALIZE SCAN</Text>
              <Text className="text-black text-xs mt-1">Video & Audio Detection</Text>
            </Pressable>

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleAnalyzeFootage}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: pressed ? '#1e40af' : '#3b82f6',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                  transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                })}
              >
                <Text className="text-white font-bold">FOOTAGE</Text>
                <Text className="text-white text-xs">Video</Text>
              </Pressable>

              <Pressable
                onPress={handleAnalyzeAudio}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: pressed ? '#7c2d12' : '#ea580c',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                  transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                })}
              >
                <Text className="text-white font-bold">AUDIO</Text>
                <Text className="text-white text-xs">Speech</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Analysis */}
          {analysisHistory.length > 0 && (
            <View className="gap-3">
              <Text className="text-gray-400 text-xs font-bold">RECENT ANALYSES</Text>

              <FlatList
                data={analysisHistory.slice(0, 5)}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleViewResult(item.id)}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#1f2937' : '#111827',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: '#374151',
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-gray-300 text-sm font-semibold truncate">
                          {item.fileName}
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </Text>
                      </View>

                      <View className="items-end gap-1">
                        <View
                          className={`px-2 py-1 rounded ${
                            item.decision.classification === 'REAL'
                              ? 'bg-green-900'
                              : item.decision.classification === 'FAKE'
                                ? 'bg-red-900'
                                : 'bg-yellow-900'
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              item.decision.classification === 'REAL'
                                ? 'text-green-400'
                                : item.decision.classification === 'FAKE'
                                  ? 'text-red-400'
                                  : 'text-yellow-400'
                            }`}
                          >
                            {item.decision.classification}
                          </Text>
                        </View>
                        <Text className="text-gray-400 text-xs">
                          {item.decision.authenticity.toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            </View>
          )}

          {/* Empty State */}
          {analysisHistory.length === 0 && (
            <View className="bg-gray-900 rounded-lg p-6 border border-gray-800 items-center gap-2">
              <Text className="text-gray-400 text-sm">No analyses yet</Text>
              <Text className="text-gray-600 text-xs text-center">
                Start by capturing or uploading media for deepfake detection
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
