import { AdminTable } from "@/components/admin-table";
import { EventsSelect } from "@/components/events-select";

import { RaceName } from "@/components/race-name";
import { RunAllOnceButton } from "@/components/run-all-once-button";
import { SyncButton } from "@/components/sync-button";
import { IsOnlineIndicator } from "@/lib/online-status-context";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  ">
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <RaceName />
          <div className="flex flex-col items-end gap-1">
            <IsOnlineIndicator />
            <div className="flex items-end gap-1">
              <EventsSelect />
              <RunAllOnceButton />

              <SyncButton />
            </div>
          </div>
        </div>
        <AdminTable />
        {/* <div className="container mx-auto py-10">
        </div> */}
      </div>
    </main>
  );
}
