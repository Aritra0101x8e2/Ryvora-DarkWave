import React from 'react';
import { Sliders, Eye, EyeOff, ToggleLeft, ToggleRight, Shield, MousePointer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface BiometricSettingsProps {
  isActive: boolean;
}

const BiometricSettings = ({ isActive }: BiometricSettingsProps) => {
  const [sensitivityLevel, setSensitivityLevel] = React.useState<number[]>([70]);
  const [features, setFeatures] = React.useState({
    typing: true,
    mouse: true,
    clickPattern: true,
    pressure: false,
    fingerprint: true,
    faceId: false,
    continuous: true
  });
  
  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };
  
  return (
    <Card className="biometric-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-biometric-text flex items-center gap-2">
          <Sliders className="h-5 w-5 text-biometric-accent" />
          Biometric Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sensitivity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm text-biometric-muted">Detection Sensitivity</Label>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-biometric-navy text-biometric-text">
                {sensitivityLevel[0]}%
              </span>
            </div>
            <Slider
              value={sensitivityLevel}
              onValueChange={setSensitivityLevel}
              max={100}
              min={0}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-biometric-muted">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          
          {/* Feature Toggles */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-biometric-text">Active Features</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="h-4 w-4 text-biometric-muted" />
                <Label className="text-sm text-biometric-muted">Typing Analysis</Label>
              </div>
              <Switch 
                checked={features.typing} 
                onCheckedChange={() => toggleFeature('typing')} 
                className="data-[state=checked]:bg-biometric-accent" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4 text-biometric-muted" />
                <Label className="text-sm text-biometric-muted">Mouse Movement</Label>
              </div>
              <Switch 
                checked={features.mouse} 
                onCheckedChange={() => toggleFeature('mouse')} 
                className="data-[state=checked]:bg-biometric-accent" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {features.continuous ? <ToggleRight className="h-4 w-4 text-biometric-muted" /> : <ToggleLeft className="h-4 w-4 text-biometric-muted" />}
                <Label className="text-sm text-biometric-muted">Continuous Verification</Label>
              </div>
              <Switch 
                checked={features.continuous} 
                onCheckedChange={() => toggleFeature('continuous')} 
                className="data-[state=checked]:bg-biometric-accent" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Fingerprint className="h-4 w-4 text-biometric-muted" />
                <Label className="text-sm text-biometric-muted">Fingerprint Authentication</Label>
              </div>
              <Switch 
                checked={features.fingerprint} 
                onCheckedChange={() => toggleFeature('fingerprint')} 
                className="data-[state=checked]:bg-biometric-accent" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {features.faceId ? <Eye className="h-4 w-4 text-biometric-muted" /> : <EyeOff className="h-4 w-4 text-biometric-muted" />}
                <Label className="text-sm text-biometric-muted">Facial Recognition</Label>
              </div>
              <Switch 
                checked={features.faceId} 
                onCheckedChange={() => toggleFeature('faceId')} 
                className="data-[state=checked]:bg-biometric-accent" 
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs border-biometric-blue/30 hover:bg-biometric-navy text-biometric-muted">
              Reset Profile
            </Button>
            <Button size="sm" className="flex-1 text-xs bg-biometric-accent hover:bg-biometric-highlight">
              <Shield className="h-3 w-3 mr-1" />
              Apply Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Keyboard = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
      <path d="M6 8h.01"/>
      <path d="M10 8h.01"/>
      <path d="M14 8h.01"/>
      <path d="M18 8h.01"/>
      <path d="M6 12h.01"/>
      <path d="M10 12h.01"/>
      <path d="M14 12h.01"/>
      <path d="M18 12h.01"/>
      <path d="M6 16h12"/>
    </svg>
  );
};

const Fingerprint = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 11c0 3.97-3 7-3 7" />
      <path d="M8 3C8.5 3 9 3.5 9 4" />
      <path d="M16 3C15.5 3 15 3.5 15 4" />
      <path d="M9 4c0 4-2 7-5.5 8" />
      <path d="M15 4c0 4 2 7 5.5 8" />
      <path d="M12 11c0 4 3 7 6 7" />
      <path d="M12 11c0 4-3 7-6 7" />
      <path d="M3 15h6" />
      <path d="M15 15h6" />
    </svg>
  );
};

export default BiometricSettings;
