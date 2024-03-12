"use client";
import {
  syncTableOperationSchema,
  operationToApi,
  type Operation,
} from "@/components/admin-table/rows";
import { IntervalSelect } from "@/components/interval-select";
import { StatusDisplay } from "@/components/status-display";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/react";
import { useInterval } from "@/lib/use-interval";
import { useSyncOperationInterval } from "@/lib/use-sync-operation-interval";
import { setLastSyncedAt } from "@/store";
import { type Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";

export interface ActionsProps {
  row: Row<Operation>;
}

export function Actions(props: ActionsProps) {
  const { row } = props;

  const [log, setLog] = useState<string[]>([]);

  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endedAt, setEndedAt] = useState<Date | null>(null);

  const lastRunDuration = useMemo(() => {
    if (!endedAt || !startedAt) return null;

    return endedAt.getTime() - startedAt.getTime();
  }, [endedAt, startedAt]);

  const operation = syncTableOperationSchema.parse(row.original);

  const operationApi = operationToApi(operation.dbTableName);

  const { mutateAsync, status } = operationApi({});

  // time how long it takes to run the operation
  //  save when it was last run
  //  save the return time of the operation in a log
  const runSyncOperation = async () => {
    if (!row) return;
    if (!row.original) return;

    if (!row.original.dbTableName) return "no dbTableName";
    const startedAt = new Date();
    setStartedAt(startedAt);
    try {
      const result = await mutateAsync();
      const endedAt = new Date();
      setEndedAt(endedAt);
      setLastSyncedAt(operation.dbTableName, endedAt);
      setLog((prev) => [
        JSON.stringify(result, null, 2),
        ...prev,

        // `Ran operation at ${startedAt.toISOString()} and finished at ${endedAt.toISOString()}`,
      ]);
      return result;
    } catch (error) {
      const endedAt = new Date();
      setEndedAt(endedAt);
      setLastSyncedAt(operation.dbTableName, endedAt);
      setLog((prev) => [
        ...prev,
        `Ran operation at ${startedAt.toISOString()} and finished at ${endedAt.toISOString()} with error: ${(error as any)?.message ?? error ?? "unknown"}`,
      ]);
      throw error;
    }
  };

  const { setSyncInterval, syncInterval } = useSyncOperationInterval({
    dbTableName: operation.dbTableName,
    runSyncOperation,
  });

  return (
    <>
      <div className="flex items-center gap-1">
        <IntervalSelect
          onRun={runSyncOperation}
          dbTableName={operation.dbTableName}
          setSyncInterval={setSyncInterval}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <StatusDisplay
              status={status}
              className="mx-1 min-w-[110px] flex-1 items-center justify-center"
            >
              {(status === "success" || status === "error") &&
                lastRunDuration && (
                  <span>({(lastRunDuration / 1000).toFixed(1)}s)</span>
                )}
            </StatusDisplay>
          </div>
        </div>
        <Button
          variant={"secondary"}
          onClick={() => {
            console.log("log", log);
          }}
        >
          Log
        </Button>
      </div>
    </>
  );
}
