
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart4, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsData {
  authMethods: Array<{ name: string; value: number; color: string }>;
  verificationSuccess: Array<{ name: string; success: number; failure: number }>;
  riskTrend: Array<{ date: string; value: number }>;
}

interface AnalyticsPanelProps {
  data: AnalyticsData;
}

const AnalyticsPanel = ({ data }: AnalyticsPanelProps) => {
  return (
    <Card className="biometric-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-biometric-text flex items-center gap-2">
          <Activity className="h-5 w-5 text-biometric-accent" />
          Security Analytics
        </CardTitle>
        <CardDescription>
          Authentication and verification statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Authentication Methods Chart */}
          <div className="bg-biometric-navy/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-biometric-text font-medium">Authentication Methods</h4>
              <PieChartIcon className="h-4 w-4 text-biometric-muted" />
            </div>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.authMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.authMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-2 space-x-4 text-xs">
              {data.authMethods.map((method, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1" 
                    style={{ backgroundColor: method.color }}
                  />
                  <span className="text-biometric-muted">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Verification Success Rate */}
          <div className="bg-biometric-navy/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-biometric-text font-medium">Verification Success Rate</h4>
              <BarChart4 className="h-4 w-4 text-biometric-muted" />
            </div>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data.verificationSuccess}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <Bar dataKey="success" stackId="a" fill="rgba(76, 175, 80, 0.7)" />
                  <Bar dataKey="failure" stackId="a" fill="rgba(244, 67, 54, 0.7)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-2 space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 mr-1 bg-biometric-success/70 rounded-full" />
                <span className="text-biometric-muted">Success</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 mr-1 bg-biometric-danger/70 rounded-full" />
                <span className="text-biometric-muted">Failure</span>
              </div>
            </div>
          </div>
          
          {/* Risk Level Trend */}
          <div className="bg-biometric-navy/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-biometric-text font-medium">Risk Level Trend</h4>
              <Activity className="h-4 w-4 text-biometric-muted" />
            </div>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.riskTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#FF9800" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-2 text-xs text-biometric-muted">
              <span>7 Days Ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-biometric-muted border-t border-biometric-blue/20 pt-3">
          <div className="flex items-center justify-between">
            <span>Total verification attempts:</span>
            <span className="text-biometric-text">142</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Success rate:</span>
            <span className="text-biometric-text">92.3%</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Average verification time:</span>
            <span className="text-biometric-text">1.4 seconds</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPanel;
