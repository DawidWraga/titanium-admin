"use client";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/lib/online-status-context";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";

export interface SyncButtonProps {}

export function SyncButton(props: SyncButtonProps) {
  const {} = props;

  const syncEnabled = useGlobalStore((state) => state.syncEnabled);
  const enableSync = useGlobalStore((state) => state.enableSync);
  const disableSync = useGlobalStore((state) => state.disableSync);
  const setSyncDisabledTurnedOffDueToConnectionError = useGlobalStore(
    (s) => s.setSyncDisabledTurnedOffDueToConnectionError,
  );

  const isOnline = useOnlineStatus();

  return (
    <>
      <Button
        className={cn(
          "py-1",
          "text-white",
          syncEnabled && "bg-green-700 hover:bg-green-600",
        )}
        disabled={!isOnline}
        onClick={() => {
          if (syncEnabled) {
            disableSync();
          } else {
            enableSync();
          }

          setSyncDisabledTurnedOffDueToConnectionError(false);
        }}
      >
        {syncEnabled
          ? "Running (press to stop) "
          : "Not running" + (isOnline ? " (press to start) " : " (offline) ")}
      </Button>
      {/* </div> */}
    </>
  );
}
