
import React from 'react';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomProgress } from '@/components/ui/custom-progress';

interface SecurityLevelProps {
  securityScore: number;
  confidenceLevel: number;
  riskFactor: number;
}

const SecurityLevel = ({ securityScore, confidenceLevel, riskFactor }: SecurityLevelProps) => {
  // Function to get appropriate color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };
  
  // Function to get appropriate status text based on score
  const getStatusText = (score: number): string => {
    if (score >= 80) return 'Secure';
    if (score >= 60) return 'Moderate';
    return 'At Risk';
  };
  
  // Function to get appropriate risk text
  const getRiskText = (risk: number): string => {
    if (risk <= 20) return 'Low Risk';
    if (risk <= 50) return 'Medium Risk';
    return 'High Risk';
  };
  
  // Function to format security metrics for display
  const formatMetrics = (metrics: { label: string; value: number; }[]): JSX.Element => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-biometric-navy/50 p-2 rounded">
            <div className="text-biometric-muted text-xs">{metric.label}</div>
            <div className="font-medium text-biometric-text">{metric.value}%</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="biometric-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-biometric-text">
          <Shield className="h-5 w-5 text-biometric-accent" />
          Security Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Security Score Section */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-biometric-muted">Security Score</span>
              <span className="text-sm font-medium text-biometric-text">{securityScore}%</span>
            </div>
            <CustomProgress 
              value={securityScore} 
              className="h-2 bg-biometric-navy" 
              indicatorClassName={getScoreColor(securityScore)}
            />
            <div className="mt-1 flex justify-between items-center">
              <span className="text-xs text-biometric-muted">Status</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                securityScore >= 80 ? 'bg-green-500/20 text-green-300' : 
                securityScore >= 60 ? 'bg-yellow-500/20 text-yellow-300' : 
                'bg-red-500/20 text-red-300'
              }`}>
                {getStatusText(securityScore)}
              </span>
            </div>
          </div>
          
          {/* Risk Factor Section */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-biometric-muted">Risk Factor</span>
              <span className="text-sm font-medium text-biometric-text">{riskFactor}%</span>
            </div>
            <CustomProgress 
              value={riskFactor} 
              className="h-2 bg-biometric-navy" 
              indicatorClassName={getScoreColor(100 - riskFactor)}
            />
            <div className="mt-1 flex justify-between items-center">
              <span className="text-xs text-biometric-muted">Assessment</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                riskFactor <= 20 ? 'bg-green-500/20 text-green-300' : 
                riskFactor <= 50 ? 'bg-yellow-500/20 text-yellow-300' : 
                'bg-red-500/20 text-red-300'
              }`}>
                <span className="flex items-center gap-1">
                  {riskFactor > 50 && <AlertTriangle className="h-3 w-3" />}
                  {getRiskText(riskFactor)}
                </span>
              </span>
            </div>
          </div>
          
          {/* Security Metrics */}
          {formatMetrics([
            { label: 'Authentication Strength', value: Math.round(securityScore * 0.9) },
            { label: 'Behavioral Match', value: Math.round(confidenceLevel) },
            { label: 'Anomaly Detection', value: Math.round(100 - riskFactor * 0.7) },
            { label: 'Trust Score', value: Math.round((securityScore + confidenceLevel) / 2) }
          ])}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityLevel;
