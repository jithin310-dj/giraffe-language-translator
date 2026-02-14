import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function ConnectionStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {isOnline ? (
        <>
          <Wifi className="h-3.5 w-3.5 text-[hsl(var(--lingua-green))]" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 text-accent" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
