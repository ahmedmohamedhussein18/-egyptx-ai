import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export interface Alert {
  id: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
}

interface AIAlertsProps {
  alerts?: Alert[];
}

const AIAlerts: React.FC<AIAlertsProps> = ({ alerts = [] }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
          text: 'text-red-400'
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
          text: 'text-amber-400'
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: <Info className="w-4 h-4 text-blue-400" />,
          text: 'text-blue-300'
        };
    }
  };

  return (
    <div className="bg-[#0A1628] rounded-xl border border-[#C9A84C]/20 p-6 shadow-[0_0_15px_rgba(201,168,76,0.1)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#030712] rounded-lg border border-[#C9A84C]/30">
          <ShieldAlert className="w-5 h-5 text-[#C9A84C]" />
        </div>
        <h3 className="text-[#C9A84C] font-semibold tracking-wider text-sm">AI ALERT CENTER</h3>
      </div>
      
      <div className="space-y-3">
        {!alerts || alerts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-[#030712] rounded-lg border border-green-500/20">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-400/80 text-sm">All systems are operating normally.</p>
          </div>
        ) : (
          alerts.map(alert => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div 
                key={alert.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border ${styles.bg} ${styles.border}`}
              >
                <div className="mt-0.5">{styles.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${styles.text} mb-1`}>{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.timestamp}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AIAlerts;
