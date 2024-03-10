import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface GlobalStore {
  syncEnabled: boolean;
  enableSync: () => void;
  disableSync: () => void;
  selectedEvents: string[];
  setSelectedEvents: (events: string[]) => void;
}

export const eventsData = [
  {
    label: "Event 1",
    value: "event-1",
  },
  {
    label: "Event 2",
    value: "event-2",
  },
  {
    label: "Event 3",
    value: "event-3",
  },
];

export const useGlobalStore = create<GlobalStore>()(
  devtools(
    persist(
      (set) => ({
        syncEnabled: false,
        enableSync: () => set({ syncEnabled: true }),
        disableSync: () => set({ syncEnabled: false }),
        selectedEvents: [],
        setSelectedEvents: (events: string[]) =>
          set({ selectedEvents: events }),
      }),
      {
        name: "global-store",
      },
    ),
  ),
);
