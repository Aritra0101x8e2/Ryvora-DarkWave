
import React from 'react';
import { User, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserCardProps {
  verificationStatus: 'unverified' | 'analyzing' | 'verified' | 'suspicious';
}

const UserCard = ({ verificationStatus }: UserCardProps) => {
  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-1 bg-biometric-success/20 text-biometric-success text-xs font-medium px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Verified
          </div>
        );
      case 'suspicious':
        return (
          <div className="flex items-center gap-1 bg-biometric-warning/20 text-biometric-warning text-xs font-medium px-2 py-1 rounded-full">
            <AlertIcon className="h-3 w-3" />
            Review
          </div>
        );
      case 'analyzing':
        return (
          <div className="flex items-center gap-1 bg-biometric-accent/20 text-biometric-accent text-xs font-medium px-2 py-1 rounded-full">
            <LoaderIcon className="h-3 w-3 animate-spin" />
            Analyzing
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-biometric-navy text-biometric-muted text-xs font-medium px-2 py-1 rounded-full">
            <User className="h-3 w-3" />
            Not Verified
          </div>
        );
    }
  };
  
  return (
    <Card className="biometric-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-biometric-blue">
            <AvatarFallback className="bg-biometric-navy text-biometric-accent">Ari</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <div className="font-medium text-biometric-text">User Ari</div>
            <div className="text-xs text-biometric-muted flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Active since April 5, 2025</span>
            </div>
            <div className="mt-1">{getVerificationBadge()}</div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-biometric-muted">
          <div className="flex justify-between py-1">
            <span>User ID:</span>
            <span className="text-biometric-text font-mono">USR-143-TK36</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Session:</span>
            <span className="text-biometric-text font-mono">SESS-3236-AFTN</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Last Login:</span>
            <span className="text-biometric-text">Today, 5:22 PM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AlertIcon = ({ className }: { className?: string }) => {
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
      <path d="M12 8v4M12 16h.01" />
      <path d="M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    </svg>
  );
};

const LoaderIcon = ({ className }: { className?: string }) => {
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
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
};

export default UserCard;
