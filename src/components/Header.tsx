
import React from 'react';
import { Shield, Activity, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

const Header = ({ isTracking, onStartTracking, onStopTracking }: HeaderProps) => {
  return (
    <header className="border-b border-biometric-blue py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-biometric-accent h-6 w-6" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-biometric-accent to-biometric-highlight bg-clip-text text-transparent">
            Ryvora by DarkWave
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1">
            <Activity className="text-biometric-accent h-4 w-4" />
            <span className="text-sm text-biometric-muted">
              {isTracking ? 'Monitoring Active' : 'Monitoring Inactive'}
            </span>
          </div>
          
          {isTracking ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onStopTracking}
              className="gap-1"
            >
              Stop Analysis
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onStartTracking}
              className="bg-biometric-accent hover:bg-biometric-highlight text-white gap-1"
            >
              Start Analysis
            </Button>
          )}
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-biometric-muted" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
