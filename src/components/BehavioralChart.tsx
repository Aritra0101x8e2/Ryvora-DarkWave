
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FileBarChart, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BehavioralChartProps {
  data: Array<{
    timestamp: string;
    typingConfidence: number;
    mouseConfidence: number;
    overallConfidence: number;
    threshold: number;
  }>;
}

const BehavioralChart = ({ data }: BehavioralChartProps) => {
  // Calculate last values for display
  const lastEntry = data.length > 0 ? data[data.length - 1] : {
    timestamp: '',
    typingConfidence: 0,
    mouseConfidence: 0,
    overallConfidence: 0,
    threshold: 70
  };
  
  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return "#4CAF50"; // success
    if (value >= threshold - 15) return "#FF9800"; // warning
    return "#F44336"; // danger
  };
  
  return (
    <Card className="biometric-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle className="text-biometric-text flex items-center gap-2">
              <FileBarChart className="h-5 w-5 text-biometric-accent" />
              Behavioral Confidence Trends
            </CardTitle>
            <CardDescription>
              Pattern matching confidence over time
            </CardDescription>
          </div>
          
          {lastEntry.overallConfidence < lastEntry.threshold && (
            <div className="flex items-center gap-1 text-xs text-biometric-warning bg-biometric-warning/10 px-2 py-1 rounded-md">
              <AlertTriangle className="h-3 w-3" />
              Anomalous behavior detected
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(11, 79, 140, 0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="rgba(144, 202, 249, 0.5)" 
                  tick={{ fill: 'rgba(144, 202, 249, 0.7)', fontSize: 10 }} 
                />
                <YAxis 
                  stroke="rgba(144, 202, 249, 0.5)" 
                  tick={{ fill: 'rgba(144, 202, 249, 0.7)', fontSize: 10 }} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(13, 33, 73, 0.9)', 
                    borderColor: 'rgba(30, 136, 229, 0.5)',
                    color: '#E3F2FD'
                  }} 
                />
                <ReferenceLine 
                  y={lastEntry.threshold} 
                  label={{ value: 'Threshold', position: 'insideTopRight', fill: 'rgba(144, 202, 249, 0.7)', fontSize: 10 }} 
                  stroke="rgba(255, 152, 0, 0.5)" 
                  strokeDasharray="3 3" 
                />
                <Line 
                  type="monotone" 
                  dataKey="typingConfidence" 
                  stroke="rgba(66, 165, 245, 0.8)" 
                  dot={false}
                  strokeWidth={2}
                  name="Typing Pattern"
                />
                <Line 
                  type="monotone" 
                  dataKey="mouseConfidence" 
                  stroke="rgba(100, 181, 246, 0.8)" 
                  dot={false}
                  strokeWidth={2}
                  name="Mouse Pattern"
                />
                <Line 
                  type="monotone" 
                  dataKey="overallConfidence" 
                  stroke="#1E88E5" 
                  activeDot={{ r: 4, fill: '#42A5F5', stroke: '#1E88E5' }}
                  strokeWidth={2.5}
                  name="Overall Confidence"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Typing Confidence</div>
              <div className="font-medium flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getStatusColor(lastEntry.typingConfidence, lastEntry.threshold) }}
                />
                <span className="text-biometric-text">
                  {lastEntry.typingConfidence.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Mouse Confidence</div>
              <div className="font-medium flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getStatusColor(lastEntry.mouseConfidence, lastEntry.threshold) }}
                />
                <span className="text-biometric-text">
                  {lastEntry.mouseConfidence.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Overall Confidence</div>
              <div className="font-medium flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getStatusColor(lastEntry.overallConfidence, lastEntry.threshold) }}
                />
                <span className="text-biometric-text">
                  {lastEntry.overallConfidence.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehavioralChart;
