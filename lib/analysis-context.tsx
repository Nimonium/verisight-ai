/**
 * Analysis Context
 * Manages analysis state, history, and results
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from './agents/types';

interface AnalysisContextType {
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisStatus: string;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  addToHistory: (analysis: AnalysisResult) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setAnalysisStatus: (status: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const STORAGE_KEY = 'verisight_analysis_history';

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored) as AnalysisResult[];
        setAnalysisHistory(history);
      }
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
  };

  const addToHistory = async (analysis: AnalysisResult) => {
    try {
      const updated = [analysis, ...analysisHistory];
      setAnalysisHistory(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save analysis:', error);
      throw error;
    }
  };

  const clearHistory = async () => {
    try {
      setAnalysisHistory([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        analysisHistory,
        isAnalyzing,
        analysisProgress,
        analysisStatus,
        setCurrentAnalysis,
        addToHistory,
        loadHistory,
        clearHistory,
        setIsAnalyzing,
        setAnalysisProgress,
        setAnalysisStatus,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
