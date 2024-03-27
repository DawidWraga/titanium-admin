"use client";
import { api } from "@/lib/trpc/react";
import { useGlobalStore } from "@/store";
import React, { useState, useEffect, useContext } from "react";

const OnlineStatusContext = React.createContext(true);

export const OnlineStatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  useEffect(() => {
    window.addEventListener("offline", () => {
      setOnlineStatus(false);
    });
    window.addEventListener("online", () => {
      setOnlineStatus(true);
    });

    return () => {
      window.removeEventListener("offline", () => {
        setOnlineStatus(false);
      });
      window.removeEventListener("online", () => {
        setOnlineStatus(true);
      });
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};

export function IsOnlineIndicator() {
  const isOnline = useOnlineStatus();

  const saveErrorLogMutation = api.saveErrorLog.useMutation();

  const {
    syncEnabled,
    enableSync,
    turnOffSyncDueToConnectionError,
    syncDisabledTurnedOffDueToConnectionError,
    setSyncDisabledTurnedOffDueToConnectionError,
  } = useGlobalStore();

  useEffect(() => {
    console.log("HERE: ", {
      isOnline,
      syncEnabled,
      enableSync,
      turnOffSyncDueToConnectionError,
      syncDisabledTurnedOffDueToConnectionError,
      setSyncDisabledTurnedOffDueToConnectionError,
    });
    if (!isOnline) {
      turnOffSyncDueToConnectionError();
      saveErrorLogMutation.mutate({
        message: "LOST CONNECTION. TURNING OFF SYNC",
        statusCode: "SYNC-AUTO-OFF",
        path: "not relevant",
      });

      return;
    }

    if (isOnline && syncDisabledTurnedOffDueToConnectionError) {
      enableSync();
      saveErrorLogMutation.mutate({
        message: "REGAINED CONNECTION. TURNING ON SYNC",
        statusCode: "SYNC-AUTO-ON",
        path: "not relevant",
      });
      setSyncDisabledTurnedOffDueToConnectionError(false);
    }
  }, [isOnline]);
  return (
    <div className="flex items-center gap-1">
      {syncDisabledTurnedOffDueToConnectionError && (
        <span className="m-1 rounded-md bg-slate-100 p-1 text-lg font-medium text-red-500">
          Sync paused due to connection error. Will retry when connection is
          back.
        </span>
      )}
      <span>{isOnline ? "Online" : "Offline"}</span>
      <div
        className={`h-3 w-3 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </div>
  );
}
