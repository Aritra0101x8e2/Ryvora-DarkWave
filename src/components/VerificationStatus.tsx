
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Shield, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VerificationStatusProps {
  status: 'unverified' | 'analyzing' | 'verified' | 'suspicious';
  score: number;
  lastChecked: Date;
  isTracking: boolean;
  onStartTracking: () => void;
}

const VerificationStatus = ({ 
  status, 
  score, 
  lastChecked,
  isTracking,
  onStartTracking
}: VerificationStatusProps) => {
  const [statusMessages] = useState({
    unverified: "User identity not verified. Start analysis to verify.",
    analyzing: "Analyzing behavioral patterns. Please continue normal usage.",
    verified: "Identity verified with high confidence based on behavioral patterns.",
    suspicious: "Unusual behavior detected. Additional verification recommended."
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className="h-6 w-6 text-biometric-success" />;
      case 'suspicious':
        return <ShieldAlert className="h-6 w-6 text-biometric-warning" />;
      case 'analyzing':
        return <Shield className="h-6 w-6 text-biometric-accent animate-pulse" />;
      default:
        return <Shield className="h-6 w-6 text-biometric-muted" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'border-biometric-success/30 bg-biometric-success/10';
      case 'suspicious':
        return 'border-biometric-warning/30 bg-biometric-warning/10';
      case 'analyzing':
        return 'border-biometric-accent/30 bg-biometric-accent/10';
      default:
        return 'border-biometric-blue/30 bg-biometric-navy/50';
    }
  };
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const timeSinceVerification = () => {
    const diffMs = currentTime.getTime() - lastChecked.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };
  
  return (
    <Card className={`biometric-card border ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold text-biometric-text">
                {status === 'verified' ? 'Identity Verified' : 
                 status === 'suspicious' ? 'Suspicious Activity' : 
                 status === 'analyzing' ? 'Verifying Identity' : 
                 'Not Verified'}
              </h3>
              <div className="flex items-center gap-1 text-xs text-biometric-muted">
                <Clock className="h-3 w-3" />
                <span>{timeSinceVerification()}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-biometric-muted mb-3">
            {statusMessages[status]}
          </p>
          
          {status === 'verified' && (
            <div className="flex items-center gap-2 mt-1 mb-3">
              <div className="bg-biometric-success/20 text-biometric-success text-xs font-medium px-2 py-1 rounded">
                Identity Match
              </div>
              <div className="text-sm font-medium text-biometric-text">
                {score.toFixed(0)}%
              </div>
            </div>
          )}
          
          {status === 'suspicious' && (
            <div className="flex items-center gap-2 mt-1 mb-3">
              <div className="bg-biometric-warning/20 text-biometric-warning text-xs font-medium px-2 py-1 rounded">
                Confidence
              </div>
              <div className="text-sm font-medium text-biometric-text">
                {score.toFixed(0)}%
              </div>
            </div>
          )}
          
          {!isTracking && status !== 'analyzing' && (
            <Button 
              onClick={onStartTracking}
              className={`mt-auto ${
                status === 'suspicious' 
                  ? 'bg-biometric-warning hover:bg-biometric-warning/80' 
                  : 'bg-biometric-accent hover:bg-biometric-highlight'
              }`}
              size="sm"
            >
              {status === 'suspicious' ? 'Re-verify Identity' : 'Verify Now'}
            </Button>
          )}
          
          {status === 'analyzing' && (
            <div className="flex items-center gap-2 mt-auto">
              <div className="w-full bg-biometric-navy/50 h-1 rounded-full overflow-hidden">
                <div className="bg-biometric-accent h-full animate-pulse" style={{ width: `${score}%` }}></div>
              </div>
              <span className="text-xs text-biometric-muted">{score.toFixed(0)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;
