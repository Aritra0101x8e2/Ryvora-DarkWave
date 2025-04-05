
import React, { useState } from 'react';
import { Keyboard, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KeypressData {
  key: string;
  pressTime: number;
  releaseTime?: number;
  duration?: number;
}

interface TypingAnalyzerProps {
  keypressData: KeypressData[];
  confidenceScore: number;
  averagePressTime: number;
  rhythm: number[];
  consistencyScore: number;
  isTracking: boolean;
}

const TypingAnalyzer = ({
  keypressData,
  confidenceScore,
  averagePressTime,
  rhythm,
  consistencyScore,
  isTracking
}: TypingAnalyzerProps) => {
  const [inputValue, setInputValue] = useState('');
  
  // Calculate active keys (keys currently being pressed)
  const activeKeys = keypressData
    .filter(kp => !kp.releaseTime)
    .map(kp => kp.key);
  
  // Generate a rhythm visualization
  const rhythmBars = rhythm.map((timing, index) => {
    // Normalize timing to a reasonable visual scale
    const height = Math.min(60, Math.max(5, (timing / 200) * 40));
    return (
      <div 
        key={index} 
        className="w-1 bg-biometric-accent rounded-t-sm" 
        style={{ height: `${height}px` }}
      />
    );
  });
  
  // Calculate the 'speed' classification based on average press time
  let speedClass = 'Average';
  if (averagePressTime > 0) {
    if (averagePressTime < 80) speedClass = 'Very Fast';
    else if (averagePressTime < 120) speedClass = 'Fast';
    else if (averagePressTime > 200) speedClass = 'Slow';
    else if (averagePressTime > 250) speedClass = 'Very Slow';
  }
  
  // Calculate the 'consistency' classification
  let consistencyClass = 'Average';
  if (consistencyScore > 80) consistencyClass = 'Very High';
  else if (consistencyScore > 60) consistencyClass = 'High';
  else if (consistencyScore < 30) consistencyClass = 'Low';
  else if (consistencyScore < 20) consistencyClass = 'Very Low';
  
  return (
    <Card className="biometric-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle className="text-biometric-text flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-biometric-accent" />
              Typing Pattern Analysis
            </CardTitle>
            <CardDescription>
              Keystroke dynamics & typing behavior
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-biometric-accent" />
            <span className="text-sm font-medium text-biometric-text">
              {confidenceScore.toFixed(0)}% Match
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border border-biometric-blue/30 rounded-md p-3 bg-biometric-dark/50">
            <label className="block text-sm text-biometric-muted mb-1">
              Type here to analyze your keystroke patterns:
            </label>
            <textarea
              className="w-full bg-transparent border border-biometric-blue/30 rounded p-2 text-biometric-text resize-none focus:outline-none focus:ring-1 focus:ring-biometric-accent"
              rows={2}
              placeholder="Start typing to analyze your unique typing pattern..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          
          {/* Key Press Visualization */}
          <div className="space-y-2">
            <h4 className="text-sm text-biometric-muted flex items-center gap-2">
              Keystroke Activity
              {isTracking && (
                <span className="inline-flex h-2 w-2 rounded-full bg-biometric-accent animate-pulse"></span>
              )}
            </h4>
            
            <div className="flex flex-wrap gap-1">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Shift', 'Space'].map((key) => {
                const isActive = activeKeys.includes(key.toLowerCase());
                return (
                  <div 
                    key={key} 
                    className={`text-xs rounded px-2 py-1 min-w-[28px] text-center transition-colors ${
                      isActive ? 'bg-biometric-accent text-white' : 'bg-biometric-navy text-biometric-muted'
                    }`}
                  >
                    {key === 'Space' ? '␣' : key}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Rhythm Visualization */}
          {rhythm.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm text-biometric-muted">Typing Rhythm Pattern</h4>
              <div className="flex items-end justify-center gap-1 h-[60px]">
                {rhythmBars}
                {rhythmBars.length === 0 && (
                  <div className="text-biometric-muted text-sm mt-4">Type more to generate pattern</div>
                )}
              </div>
            </div>
          )}
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Speed</div>
              <div className="font-medium text-biometric-text">
                {speedClass}
                <span className="text-xs text-biometric-muted ml-1">
                  ({averagePressTime.toFixed(0)} ms)
                </span>
              </div>
            </div>
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Consistency</div>
              <div className="font-medium text-biometric-text">
                {consistencyClass}
                <span className="text-xs text-biometric-muted ml-1">
                  ({consistencyScore.toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypingAnalyzer;
