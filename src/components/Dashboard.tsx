import React, { useState, useEffect } from 'react';
import Header from './Header';
import TypingAnalyzer from './TypingAnalyzer';
import MouseTracker from './MouseTracker';
import VerificationStatus from './VerificationStatus';
import BehavioralChart from './BehavioralChart';
import SecurityLevel from './SecurityLevel';
import UserCard from './UserCard';
import BiometricSettings from './BiometricSettings';
import AnalyticsPanel from './AnalyticsPanel';
import { useBiometrics } from '@/hooks/useBiometrics';

const Dashboard = () => {
  const { 
    isTracking, 
    startTracking, 
    stopTracking, 
    keypressData, 
    mouseData,
    verificationStatus,
    securityScore,
    confidenceLevel,
    biometricData
  } = useBiometrics();
  
  // Generate mock chart data
  const [chartData, setChartData] = useState<Array<{
    timestamp: string;
    typingConfidence: number;
    mouseConfidence: number;
    overallConfidence: number;
    threshold: number;
  }>>([]);
  
  // Mock analytics data
  const analyticsData = {
    authMethods: [
      { name: 'Behavioral', value: 65, color: '#1E88E5' },
      { name: 'Password', value: 20, color: '#42A5F5' },
      { name: 'Fingerprint', value: 15, color: '#90CAF9' }
    ],
    verificationSuccess: [
      { name: 'Mon', success: 95, failure: 5 },
      { name: 'Tue', success: 88, failure: 12 },
      { name: 'Wed', success: 92, failure: 8 },
      { name: 'Thu', success: 96, failure: 4 },
      { name: 'Fri', success: 90, failure: 10 },
      { name: 'Sat', success: 85, failure: 15 },
      { name: 'Sun', success: 93, failure: 7 }
    ],
    riskTrend: [
      { date: 'Mon', value: 45 },
      { date: 'Tue', value: 38 },
      { date: 'Wed', value: 42 },
      { date: 'Thu', value: 30 },
      { date: 'Fri', value: 35 },
      { date: 'Sat', value: 28 },
      { date: 'Sun', value: 25 }
    ]
  };
  
  // Generate chart data on component mount
  useEffect(() => {
    const baseTime = new Date();
    const data = [];
    
    // Generate 12 data points, one every 5 minutes
    for (let i = 0; i < 12; i++) {
      const time = new Date(baseTime.getTime() - (11 - i) * 5 * 60000);
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Generate random but realistic values
      const typingConfidence = 60 + Math.random() * 30;
      const mouseConfidence = 65 + Math.random() * 25;
      
      // Make overall confidence a weighted average of the two
      const overallConfidence = (typingConfidence * 0.6) + (mouseConfidence * 0.4);
      
      data.push({
        timestamp: formattedTime,
        typingConfidence,
        mouseConfidence,
        overallConfidence,
        threshold: 70 // Security threshold line
      });
    }
    
    setChartData(data);
  }, []);
  
  // Update chart periodically when tracking is active
  useEffect(() => {
    if (!isTracking) return;
    
    const updateInterval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setChartData(prev => {
        // Keep only the latest 11 entries
        const newData = [...prev.slice(-11)];
        
        // Add new entry with biometric data confidence scores
        newData.push({
          timestamp: formattedTime,
          typingConfidence: biometricData.typing.confidenceScore,
          mouseConfidence: biometricData.mouse.confidenceScore,
          overallConfidence: biometricData.overall.confidenceLevel,
          threshold: 70
        });
        
        return newData;
      });
    }, 5000);
    
    return () => clearInterval(updateInterval);
  }, [isTracking, biometricData]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isTracking={isTracking} 
        onStartTracking={startTracking} 
        onStopTracking={stopTracking} 
      />
      
      <main className="container py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="space-y-5">
            <UserCard verificationStatus={verificationStatus} />
            <VerificationStatus 
              status={verificationStatus} 
              score={securityScore} 
              lastChecked={biometricData.verification.lastChecked}
              isTracking={isTracking}
              onStartTracking={startTracking}
            />
            <SecurityLevel 
              securityScore={securityScore}
              confidenceLevel={confidenceLevel}
              riskFactor={biometricData.overall.riskFactor}
            />
          </div>
          
          {/* Middle column */}
          <div className="lg:col-span-2 space-y-5">
            <BehavioralChart data={chartData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TypingAnalyzer 
                keypressData={keypressData}
                confidenceScore={biometricData.typing.confidenceScore}
                averagePressTime={biometricData.typing.averagePressTime}
                rhythm={biometricData.typing.rhythm}
                consistencyScore={biometricData.typing.consistencyScore}
                isTracking={isTracking}
              />
              <MouseTracker 
                mouseData={mouseData}
                isTracking={isTracking}
                averageSpeed={biometricData.mouse.averageSpeed}
                directionChanges={biometricData.mouse.directionChanges}
                patternScore={biometricData.mouse.patternScore}
                confidenceScore={biometricData.mouse.confidenceScore}
              />
            </div>
            <AnalyticsPanel data={analyticsData} />
            <BiometricSettings isActive={isTracking} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
