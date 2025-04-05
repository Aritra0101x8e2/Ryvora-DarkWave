
import { useState, useEffect, useRef } from "react";

type KeypressData = {
  key: string;
  pressTime: number;
  releaseTime?: number;
  duration?: number;
};

type MouseMovementData = {
  x: number;
  y: number;
  timestamp: number;
  speed?: number;
  direction?: number;
};

interface BiometricData {
  typing: {
    keyPressTimes: KeypressData[];
    averagePressTime: number;
    rhythm: number[];
    consistencyScore: number;
    confidenceScore: number;
  };
  mouse: {
    movements: MouseMovementData[];
    averageSpeed: number;
    directionChanges: number;
    patternScore: number;
    confidenceScore: number;
  };
  verification: {
    status: 'unverified' | 'analyzing' | 'verified' | 'suspicious';
    score: number;
    lastChecked: Date;
  };
  overall: {
    securityScore: number;
    confidenceLevel: number;
    riskFactor: number;
  };
}

export function useBiometrics() {
  const [isTracking, setIsTracking] = useState(false);
  const [keypressData, setKeypressData] = useState<KeypressData[]>([]);
  const [mouseData, setMouseData] = useState<MouseMovementData[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'analyzing' | 'verified' | 'suspicious'>('unverified');
  const [securityScore, setSecurityScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const lastMousePosition = useRef<{ x: number; y: number; timestamp: number } | null>(null);
  const activeKeys = useRef<Record<string, number>>({});
  const analysisTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [biometricData, setBiometricData] = useState<BiometricData>({
    typing: {
      keyPressTimes: [],
      averagePressTime: 0,
      rhythm: [],
      consistencyScore: 0,
      confidenceScore: 0
    },
    mouse: {
      movements: [],
      averageSpeed: 0,
      directionChanges: 0,
      patternScore: 0,
      confidenceScore: 0
    },
    verification: {
      status: 'unverified',
      score: 0,
      lastChecked: new Date()
    },
    overall: {
      securityScore: 0,
      confidenceLevel: 0,
      riskFactor: 30 // Initial risk factor
    }
  });

  // Start tracking behavior
  const startTracking = () => {
    setIsTracking(true);
    setVerificationStatus('analyzing');
    
    // Reset data when starting new tracking session
    setKeypressData([]);
    setMouseData([]);
    
    if (analysisTimeout.current) {
      clearTimeout(analysisTimeout.current);
    }
    
    // Set timeout to "complete" analysis
    analysisTimeout.current = setTimeout(() => {
      const randomScore = 70 + Math.random() * 25;
      const randomConfidence = 80 + Math.random() * 15;
      setSecurityScore(Math.min(100, randomScore));
      setConfidenceLevel(Math.min(100, randomConfidence));
      setVerificationStatus(randomScore > 85 ? 'verified' : 'suspicious');
      
      // Update overall biometric data
      updateBiometricData();
    }, 5000);
  };

  // Stop tracking behavior
  const stopTracking = () => {
    setIsTracking(false);
    if (analysisTimeout.current) {
      clearTimeout(analysisTimeout.current);
      analysisTimeout.current = null;
    }
  };

  // Handle keydown events
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isTracking) return;
    
    const now = performance.now();
    activeKeys.current[e.key] = now;
    
    const newKeypressData: KeypressData = {
      key: e.key,
      pressTime: now,
    };
    
    setKeypressData(prev => [...prev.slice(-50), newKeypressData]);
  };

  // Handle keyup events
  const handleKeyUp = (e: KeyboardEvent) => {
    if (!isTracking || !activeKeys.current[e.key]) return;
    
    const now = performance.now();
    const pressTime = activeKeys.current[e.key];
    const duration = now - pressTime;
    delete activeKeys.current[e.key];
    
    setKeypressData(prev => {
      const updated = [...prev];
      const keyIndex = updated.findIndex(k => k.key === e.key && !k.releaseTime);
      
      if (keyIndex !== -1) {
        updated[keyIndex] = {
          ...updated[keyIndex],
          releaseTime: now,
          duration: duration
        };
      }
      
      return updated;
    });
  };

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!isTracking) return;
    
    const now = performance.now();
    const newPosition = { x: e.clientX, y: e.clientY, timestamp: now };
    
    if (lastMousePosition.current) {
      const prev = lastMousePosition.current;
      const dx = newPosition.x - prev.x;
      const dy = newPosition.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDiff = (now - prev.timestamp) / 1000; // Convert to seconds
      
      if (timeDiff > 0 && distance > 5) { // Ignore very small movements
        const speed = distance / timeDiff;
        const direction = Math.atan2(dy, dx);
        
        const newMouseData: MouseMovementData = {
          x: newPosition.x,
          y: newPosition.y,
          timestamp: now,
          speed,
          direction
        };
        
        setMouseData(prev => [...prev.slice(-100), newMouseData]);
      }
    }
    
    lastMousePosition.current = newPosition;
  };
  
  // Calculate biometric statistics from collected data
  const updateBiometricData = () => {
    // Calculate typing statistics
    const validKeyPresses = keypressData.filter(k => k.duration);
    const averagePressTime = validKeyPresses.length > 0
      ? validKeyPresses.reduce((sum, k) => sum + (k.duration || 0), 0) / validKeyPresses.length
      : 0;
    
    // Calculate keystroke rhythm (time between presses)
    const rhythm: number[] = [];
    for (let i = 1; i < keypressData.length; i++) {
      rhythm.push(keypressData[i].pressTime - keypressData[i-1].pressTime);
    }
    
    // Calculate consistency score based on standard deviation of keystroke timing
    const consistencyScore = calculateConsistencyScore(rhythm);
    
    // Calculate mouse movement statistics
    const validMovements = mouseData.filter(m => m.speed !== undefined);
    const averageSpeed = validMovements.length > 0
      ? validMovements.reduce((sum, m) => sum + (m.speed || 0), 0) / validMovements.length
      : 0;
    
    // Count direction changes
    let directionChanges = 0;
    for (let i = 1; i < validMovements.length; i++) {
      if (validMovements[i].direction !== undefined && 
          validMovements[i-1].direction !== undefined &&
          Math.abs(validMovements[i].direction! - validMovements[i-1].direction!) > 0.5) {
        directionChanges++;
      }
    }
    
    // Calculate pattern score based on movement consistency
    const patternScore = calculatePatternScore(validMovements);
    
    // Update biometric data state
    setBiometricData({
      typing: {
        keyPressTimes: keypressData.slice(-10), // Keep only recent data
        averagePressTime,
        rhythm: rhythm.slice(-10),
        consistencyScore,
        confidenceScore: Math.min(100, 40 + consistencyScore * 0.6)
      },
      mouse: {
        movements: mouseData.slice(-20),
        averageSpeed,
        directionChanges,
        patternScore,
        confidenceScore: Math.min(100, 30 + patternScore * 0.7)
      },
      verification: {
        status: verificationStatus,
        score: securityScore,
        lastChecked: new Date()
      },
      overall: {
        securityScore,
        confidenceLevel,
        riskFactor: Math.max(5, 100 - securityScore * 0.7 - confidenceLevel * 0.3)
      }
    });
  };
  
  // Helper function to calculate consistency score
  const calculateConsistencyScore = (rhythm: number[]): number => {
    if (rhythm.length < 2) return 0;
    
    const avg = rhythm.reduce((sum, val) => sum + val, 0) / rhythm.length;
    const squareDiffs = rhythm.map(val => (val - avg) ** 2);
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);
    
    // Lower deviation means higher consistency
    const maxStdDev = 300; // Arbitrary max value for normalization
    return Math.max(0, 100 - (stdDev / maxStdDev) * 100);
  };
  
  // Helper function to calculate pattern score
  const calculatePatternScore = (movements: MouseMovementData[]): number => {
    if (movements.length < 5) return 0;
    
    // Calculate variation in speed and direction
    const speeds = movements.map(m => m.speed || 0);
    const speedVariation = calculateVariation(speeds);
    
    const directions = movements
      .map(m => m.direction || 0)
      .filter((_, i) => i % 2 === 0); // Sample every other point to reduce noise
    const directionVariation = calculateVariation(directions);
    
    // Score is higher when variations are lower (more consistent patterns)
    return Math.max(0, 100 - speedVariation * 0.5 - directionVariation * 0.5);
  };
  
  // Helper function to calculate variation coefficient
  const calculateVariation = (values: number[]): number => {
    if (values.length < 2) return 100; // Maximum variation if not enough data
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    if (Math.abs(avg) < 0.001) return 100; // Avoid division by zero
    
    const squareDiffs = values.map(val => (val - avg) ** 2);
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);
    
    return (stdDev / Math.abs(avg)) * 100; // Coefficient of variation as percentage
  };

  // Set up event listeners
  useEffect(() => {
    if (isTracking) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('mousemove', handleMouseMove);
      
      // Update biometric data periodically
      const updateInterval = setInterval(updateBiometricData, 1000);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(updateInterval);
      };
    }
  }, [isTracking]);

  return {
    isTracking,
    startTracking,
    stopTracking,
    keypressData,
    mouseData,
    verificationStatus,
    securityScore,
    confidenceLevel,
    biometricData
  };
}
