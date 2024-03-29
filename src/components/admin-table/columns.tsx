"use client";
import { Actions } from "@/components/admin-table/actions";
import { format } from "date-fns";

import { DatabaseHeaderCell } from "@/components/database-header-cell";
import { Operation, SyncDbTableName } from "@/schemas";
import { useLastSyncedAt } from "@/store";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Operation>[] = [
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as Status;
  //     return (
  //       <div className="flex w-[100px] items-center">
  //         <StatusDisplay status={status} />
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "dbTableName",
    header: "Table Name",
    cell: ({ row }) => {
      const dbTableName = row.getValue("dbTableName") as string;
      return (
        <div className="min-w-[130px] flex-1 font-semibold">{dbTableName}</div>
      );
    },
  },
  {
    accessorKey: "localDbItemsCount",
    // header: "Local DB ",
    header: ({ column }) => {
      return (
        <DatabaseHeaderCell
          databaseLabel="RaceTec"
          databaseTableName="the actual name of the local db"
          onEditDatabaseName={() => {}}
        />
      );
    },
    cell: ({ row }) => {
      const localDbItemsCount = row.getValue("localDbItemsCount") as number;
      const formattedCount = localDbItemsCount.toLocaleString();
      return (
        <div className="text-center font-mono text-[16px]">
          {formattedCount}
        </div>
      );
    },
  },
  {
    accessorKey: "remoteDbItemsCount",
    header: ({ column }) => {
      return (
        <DatabaseHeaderCell
          databaseLabel="Remote"
          databaseTableName="the actual name of the remote db"
          onEditDatabaseName={() => {}}
        />
      );
    },
    cell: ({ row }) => {
      const remoteDbItemsCount = row.getValue("remoteDbItemsCount") as number;
      const formattedCount = remoteDbItemsCount.toLocaleString();
      return (
        <div className="text-center font-mono text-[16px]">
          {formattedCount}
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Synced At",
    cell: ({ row }) => {
      const dbTableName = row.getValue("dbTableName") as SyncDbTableName;
      return <LastSyncedAtCell dbTableName={dbTableName} />;
    },
  },
  // {
  //   accessorKey: "sqlSpeed",
  //   header: "SQL Speed",
  //   cell: ({ row }) => {
  //     const sqlSpeed = row.getValue("sqlSpeed") as number;
  //     const formattedSpeed = sqlSpeed.toFixed(0);
  //     return <div className="">{formattedSpeed}ms</div>;
  //   },
  // },
  {
    id: "actions",
    header: "Sync interval",
    cell: ({ row }) => <Actions row={row} />,
  },
];

function LastSyncedAtCell({ dbTableName }: { dbTableName: SyncDbTableName }) {
  const lastSyncedAt = useLastSyncedAt(dbTableName);
  if (!lastSyncedAt) return null;
  return (
    <div className="flex flex-col ">
      <span>{format(lastSyncedAt, "p")}</span>
      <span className="text-sm text-muted-foreground">
        {format(lastSyncedAt, "P")}
      </span>
    </div>
  );
}

/**
 * - status
    - color to indicate
    - tooltip with extra info (fill later)
- local db name
    - just show "local db count" BUT also show edit icon
    - on edit, show the actula db name, and allow to change
- remote db name
    - ^^
- updated at
- sql speed
    - show warning based on durations compared to expected duration in config.json
- sync options
    - disabled
    - whichever is selected, show as the valueshow value + (duration ms) in brackets 
        - disable
        - normal interval
        - slow mode interval
        - custom interval
- force sync action
    - on click run sync query
    - useful for disabled intervals
- log 
    - for problem solving 
    - dont want full return value, overwhelming numbe of data
    - summary eg 
    - add more info later
    - store logs as a text file
        - useful for troubleshooting later
    - consider whether to store locally vs in remote db




- consider for later
    - on error, show desktop notification
        - maybe spam notifcations?
    - future also sms


- how do we know internet connection failure?
    - dont ping
    - just if a query error code says network error then send a notification
- on error change the status column specifically for that row
    - on hover/click show the actual error message

 */
