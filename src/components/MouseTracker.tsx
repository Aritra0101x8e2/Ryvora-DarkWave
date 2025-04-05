
import React, { useRef, useEffect } from 'react';
import { MousePointer, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MouseMovementData {
  x: number;
  y: number;
  timestamp: number;
  speed?: number;
  direction?: number;
}

interface MouseTrackerProps {
  mouseData: MouseMovementData[];
  isTracking: boolean;
  averageSpeed: number;
  directionChanges: number;
  patternScore: number;
  confidenceScore: number;
}

const MouseTracker = ({ 
  mouseData, 
  isTracking, 
  averageSpeed, 
  directionChanges,
  patternScore,
  confidenceScore 
}: MouseTrackerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the mouse movement visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match its display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(11, 79, 140, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 20;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Exit if no mouse data
    if (mouseData.length < 2) return;
    
    // Scale mouse coordinates to canvas size
    const scaleX = (x: number) => (x / window.innerWidth) * canvas.width;
    const scaleY = (y: number) => (y / window.innerHeight) * canvas.height;
    
    // Draw mouse path
    ctx.strokeStyle = 'rgba(66, 165, 245, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Get last 50 movements for visualization
    const recentMoves = mouseData.slice(-50);
    
    ctx.moveTo(scaleX(recentMoves[0].x), scaleY(recentMoves[0].y));
    
    for (let i = 1; i < recentMoves.length; i++) {
      ctx.lineTo(scaleX(recentMoves[i].x), scaleY(recentMoves[i].y));
    }
    
    ctx.stroke();
    
    // Draw points at each recorded mouse position
    for (let i = 0; i < recentMoves.length; i++) {
      // Increase opacity for more recent points
      const opacity = 0.3 + (i / recentMoves.length) * 0.7;
      const size = i === recentMoves.length - 1 ? 4 : 2;
      
      ctx.fillStyle = `rgba(66, 165, 245, ${opacity})`;
      ctx.beginPath();
      ctx.arc(
        scaleX(recentMoves[i].x), 
        scaleY(recentMoves[i].y), 
        size, 0, Math.PI * 2
      );
      ctx.fill();
      
      // Draw direction indicator for points with speed data
      if (recentMoves[i].direction !== undefined && i % 5 === 0) {
        const direction = recentMoves[i].direction;
        const length = 5 + (recentMoves[i].speed || 0) / 10;
        
        ctx.strokeStyle = `rgba(66, 165, 245, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(scaleX(recentMoves[i].x), scaleY(recentMoves[i].y));
        ctx.lineTo(
          scaleX(recentMoves[i].x) + Math.cos(direction!) * length,
          scaleY(recentMoves[i].y) + Math.sin(direction!) * length
        );
        ctx.stroke();
      }
    }
    
    // Draw current cursor position with highlight
    if (recentMoves.length > 0) {
      const lastPoint = recentMoves[recentMoves.length - 1];
      
      // Glow effect
      const gradient = ctx.createRadialGradient(
        scaleX(lastPoint.x), scaleY(lastPoint.y), 0,
        scaleX(lastPoint.x), scaleY(lastPoint.y), 10
      );
      gradient.addColorStop(0, 'rgba(66, 165, 245, 0.8)');
      gradient.addColorStop(1, 'rgba(66, 165, 245, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(scaleX(lastPoint.x), scaleY(lastPoint.y), 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [mouseData]);
  
  // Determine speed classification
  let speedClass = 'Average';
  if (averageSpeed > 0) {
    if (averageSpeed > 1000) speedClass = 'Very Fast';
    else if (averageSpeed > 600) speedClass = 'Fast';
    else if (averageSpeed < 200) speedClass = 'Slow';
    else if (averageSpeed < 100) speedClass = 'Very Slow';
  }
  
  // Determine pattern classification
  let patternClass = 'Average';
  if (patternScore > 80) patternClass = 'Very Consistent';
  else if (patternScore > 60) patternClass = 'Consistent';
  else if (patternScore < 30) patternClass = 'Erratic';
  else if (patternScore < 20) patternClass = 'Very Erratic';
  
  return (
    <Card className="biometric-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle className="text-biometric-text flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-biometric-accent" />
              Mouse Movement Analysis
            </CardTitle>
            <CardDescription>
              Cursor dynamics & movement patterns
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-biometric-accent" />
            <span className="text-sm font-medium text-biometric-text">
              {confidenceScore.toFixed(0)}% Match
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mouse movement canvas */}
          <div className="relative border border-biometric-blue/30 rounded-md overflow-hidden bg-biometric-dark/50">
            <canvas 
              ref={canvasRef} 
              className="w-full h-[180px]"
            />
            
            {isTracking && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-biometric-accent bg-biometric-navy/80 px-2 py-1 rounded">
                <span className="inline-flex h-2 w-2 rounded-full bg-biometric-accent animate-pulse"></span>
                Tracking
              </div>
            )}
            
            {mouseData.length < 5 && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-biometric-muted">
                {isTracking ? 'Move your mouse to generate data' : 'Start tracking to analyze mouse movements'}
              </div>
            )}
          </div>
          
          {/* Mouse metrics */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Movement Speed</div>
              <div className="font-medium text-biometric-text">
                {speedClass}
                <span className="text-xs text-biometric-muted ml-1">
                  ({averageSpeed.toFixed(0)})
                </span>
              </div>
            </div>
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Direction Changes</div>
              <div className="font-medium text-biometric-text">
                {directionChanges}
                <span className="text-xs text-biometric-muted ml-1">
                  changes
                </span>
              </div>
            </div>
            <div className="bg-biometric-navy/50 p-2 rounded">
              <div className="text-biometric-muted text-xs">Pattern</div>
              <div className="font-medium text-biometric-text">
                {patternClass}
              </div>
            </div>
          </div>
          
          {/* Pattern interpretation */}
          <div className="text-xs text-biometric-muted border-t border-biometric-blue/20 pt-2">
            {patternScore > 50 ? (
              <p>Your mouse movement pattern shows consistent behavior matching your profile.</p>
            ) : patternScore > 30 ? (
              <p>Mouse movement pattern shows moderate variability but remains within expected parameters.</p>
            ) : (
              <p>Mouse movement pattern differs from your typical behavior. Verification recommended.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MouseTracker;
