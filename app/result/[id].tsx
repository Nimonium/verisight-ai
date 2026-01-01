/**
 * Result Screen
 * Displays analysis results with authenticity score and explanation
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAnalysis } from '@/lib/analysis-context';
import { AnalysisResult } from '@/lib/agents/types';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const { analysisHistory } = useAnalysis();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const found = analysisHistory.find(r => r.id === id);
    if (found) {
      setResult(found);
    }
  }, [params.id, analysisHistory]);

  if (!result) {
    return (
      <ScreenContainer containerClassName="bg-black" className="flex-1 items-center justify-center">
        <Text className="text-gray-400">Loading result...</Text>
      </ScreenContainer>
    );
  }

  const isReal = result.decision.classification === 'REAL';
  const isFake = result.decision.classification === 'FAKE';
  const isUncertain = result.decision.classification === 'UNCERTAIN';

  const getResultColor = () => {
    if (isReal) return '#22c55e';
    if (isFake) return '#ef4444';
    return '#eab308';
  };

  const getRiskColor = () => {
    if (result.decision.riskLevel === 'LOW') return '#22c55e';
    if (result.decision.riskLevel === 'MEDIUM') return '#eab308';
    return '#ef4444';
  };

  const handleNewScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('../../capture');
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <ScreenContainer containerClassName="bg-black" className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between pt-2">
            <Text className="text-2xl font-bold text-green-500">ANALYSIS RESULT</Text>
            <Pressable onPress={handleBack} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Text className="text-gray-400 text-lg">←</Text>
            </Pressable>
          </View>

          {/* Large Result Indicator */}
          <View className="items-center gap-4">
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 4,
                borderColor: getResultColor(),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View className="items-center gap-2">
                <Text style={{ fontSize: 48, color: getResultColor() }} className="font-bold">
                  {result.decision.authenticity.toFixed(0)}%
                </Text>
                <Text style={{ color: getResultColor() }} className="text-sm font-semibold">
                  AUTHENTICITY
                </Text>
              </View>
            </View>

            {/* Classification Badge */}
            <View
              style={{
                backgroundColor:
                  isReal ? '#064e3b' : isFake ? '#7f1d1d' : '#713f12',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ color: getResultColor() }}
                className="font-bold text-lg"
              >
                {result.decision.classification === 'REAL'
                  ? '✓ VERIFIED REAL'
                  : result.decision.classification === 'FAKE'
                    ? '✗ VERIFIED FAKE'
                    : '? UNCERTAIN'}
              </Text>
            </View>
          </View>

          {/* Detection Summary */}
          <View className="bg-gray-900 rounded-lg p-4 border border-gray-800 gap-3">
            <Text className="text-gray-400 text-xs font-bold">DETECTION SUMMARY</Text>

            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Deepfake Probability</Text>
                <Text className="text-red-400 font-semibold">{result.decision.deepfakeProbability.toFixed(1)}%</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Confidence Level</Text>
                <Text className="text-green-400 font-semibold">{result.decision.confidence.toFixed(0)}%</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Risk Level</Text>
                <Text style={{ color: getRiskColor() }} className="font-semibold">
                  {result.decision.riskLevel}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Processing Time</Text>
                <Text className="text-gray-400 font-semibold">
                  {(result.detection.inferenceTimeMs + result.decision.processingTimeMs).toFixed(0)}ms
                </Text>
              </View>
            </View>
          </View>

          {/* Key Findings */}
          <View className="bg-gray-900 rounded-lg p-4 border border-gray-800 gap-3">
            <Text className="text-gray-400 text-xs font-bold">KEY FINDINGS</Text>

            {result.explanation.keyFindings.map((finding, i) => (
              <View key={i} className="flex-row gap-2">
                <Text className="text-green-500 font-bold">•</Text>
                <Text className="text-gray-300 text-sm flex-1">{finding}</Text>
              </View>
            ))}
          </View>

          {/* Detected Artifacts */}
          {result.explanation.artifacts.length > 0 && (
            <View className="bg-gray-900 rounded-lg p-4 border border-gray-800 gap-3">
              <Text className="text-gray-400 text-xs font-bold">DETECTED ARTIFACTS</Text>

              {result.explanation.artifacts.map((artifact, i) => (
                <View key={i} className="flex-row gap-2">
                  <Text className="text-yellow-500 font-bold">⚠</Text>
                  <Text className="text-gray-300 text-sm flex-1">{artifact}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Explanation */}
          <View className="bg-gray-900 rounded-lg p-4 border border-gray-800 gap-2">
            <Text className="text-gray-400 text-xs font-bold">EXPLANATION</Text>
            <Text className="text-gray-300 text-sm leading-relaxed">{result.explanation.summary}</Text>
          </View>

          {/* Recommendations */}
          <View className="bg-gray-900 rounded-lg p-4 border border-gray-800 gap-3">
            <Text className="text-gray-400 text-xs font-bold">RECOMMENDATIONS</Text>

            {result.explanation.recommendations.map((rec, i) => (
              <View key={i} className="flex-row gap-2">
                <Text className="text-blue-500 font-bold">→</Text>
                <Text className="text-gray-300 text-sm flex-1">{rec}</Text>
              </View>
            ))}
          </View>

          {/* File Info */}
          <View className="bg-gray-900 rounded-lg p-4 border border-gray-800 gap-2">
            <Text className="text-gray-400 text-xs font-bold">FILE INFORMATION</Text>
            <View className="gap-1">
              <Text className="text-gray-400 text-xs">
                <Text className="font-semibold">File:</Text> {result.fileName}
              </Text>
              <Text className="text-gray-400 text-xs">
                <Text className="font-semibold">Type:</Text> {result.mediaType.toUpperCase()}
              </Text>
              <Text className="text-gray-400 text-xs">
                <Text className="font-semibold">Size:</Text> {(result.fileSizeBytes / 1024 / 1024).toFixed(2)} MB
              </Text>
              <Text className="text-gray-400 text-xs">
                <Text className="font-semibold">Analyzed:</Text>{' '}
                {new Date(result.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="gap-3 mt-8">
        <Pressable
          onPress={handleNewScan}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#16a34a' : '#22c55e',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
          })}
        >
          <Text className="text-black font-bold text-lg">NEW SCAN</Text>
        </Pressable>

        <Pressable
          onPress={handleBack}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: '#374151',
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-gray-400 font-semibold">BACK TO DASHBOARD</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
