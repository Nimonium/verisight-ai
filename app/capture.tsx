/**
 * Capture / Upload Screen
 * Allows users to capture or upload video/audio for analysis
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as DocumentPicker from 'expo-document-picker';
import { useAnalysis } from '@/lib/analysis-context';
import { AnalysisOrchestrator } from '@/lib/agents/analysis-orchestrator';

type MediaType = 'video' | 'audio';

export default function CaptureScreen() {
  const params = useLocalSearchParams();
  const mediaType = (params.type as MediaType) || 'video';
  const { setCurrentAnalysis, setIsAnalyzing, setAnalysisProgress, setAnalysisStatus, addToHistory } = useAnalysis();

  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; uri: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePickFile = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const result = await DocumentPicker.getDocumentAsync({
        type: mediaType === 'video' ? 'video/*' : 'audio/*',
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          name: asset.name,
          size: asset.size || 0,
          uri: asset.uri,
        });
      }
    } catch (error) {
      console.error('File picker error:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStatus('Initializing analysis...');

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Initialize orchestrator
      const orchestrator = new AnalysisOrchestrator();
      await orchestrator.initialize();

      // Simulate progress updates
      setAnalysisProgress(10);
      setAnalysisStatus('Detection Agent: Extracting features...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAnalysisProgress(40);
      setAnalysisStatus('Detection Agent: Running inference...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAnalysisProgress(60);
      setAnalysisStatus('Decision Agent: Aggregating results...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setAnalysisProgress(80);
      setAnalysisStatus('Cognitive Agent: Generating explanation...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Run analysis
      const result = await orchestrator.analyze(
        {
          mediaType,
          mediaUri: selectedFile.uri,
        },
        selectedFile.name,
        selectedFile.size
      );

      setAnalysisProgress(100);
      setAnalysisStatus('Analysis complete');

      // Save to history
      await addToHistory(result);
      setCurrentAnalysis(result);

      // Navigate to result screen
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(`../result/${result.id}`);
    } catch (error) {
      console.error('Analysis error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAnalysisStatus('Analysis failed');
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <ScreenContainer containerClassName="bg-black" className="flex-1 justify-between p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-green-500">SECURE CAPTURE</Text>
            <Text className="text-xs text-gray-500">
              {mediaType === 'video' ? 'VIDEO ANALYSIS' : 'AUDIO ANALYSIS'}
            </Text>
          </View>

          {/* Upload Area */}
          <Pressable
            onPress={handlePickFile}
            disabled={isProcessing}
            style={({ pressed }) => ({
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: selectedFile ? '#22c55e' : '#374151',
              borderRadius: 12,
              padding: 32,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedFile ? '#064e3b' : '#111827',
              opacity: pressed && !isProcessing ? 0.8 : 1,
            })}
          >
            <Text className="text-4xl mb-2">{mediaType === 'video' ? '🎥' : '🎙️'}</Text>
            <Text className="text-gray-300 font-semibold text-center">
              {selectedFile ? 'Change File' : 'Select File'}
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-2">
              {mediaType === 'video' ? 'MP4, MOV, WebM' : 'MP3, WAV, M4A'}
            </Text>
          </Pressable>

          {/* Selected File Info */}
          {selectedFile && (
            <View className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <Text className="text-gray-400 text-xs font-bold mb-2">FILE SELECTED</Text>
              <Text className="text-green-400 font-semibold truncate">{selectedFile.name}</Text>
              <Text className="text-gray-500 text-xs mt-1">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          )}

          {/* Status Message */}
          <View className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 rounded-full bg-green-500" />
              <Text className="text-green-500 text-xs font-bold">OFFLINE MODE</Text>
            </View>
            <Text className="text-gray-400 text-xs leading-relaxed">
              All processing occurs on-device. No data is transmitted or stored externally.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="gap-3 mt-8">
        <Pressable
          onPress={handleAnalyze}
          disabled={!selectedFile || isProcessing}
          style={({ pressed }) => ({
            backgroundColor: selectedFile && !isProcessing ? '#22c55e' : '#374151',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            transform: pressed && selectedFile && !isProcessing ? [{ scale: 0.97 }] : [{ scale: 1 }],
          })}
        >
          <Text
            className={`font-bold text-lg ${
              selectedFile && !isProcessing ? 'text-black' : 'text-gray-500'
            }`}
          >
            {isProcessing ? 'PROCESSING...' : 'PROCEED'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleCancel}
          disabled={isProcessing}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: '#374151',
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
            opacity: pressed && !isProcessing ? 0.7 : 1,
          })}
        >
          <Text className="text-gray-400 font-semibold">CANCEL</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
