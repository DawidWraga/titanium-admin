"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { useEffect } from "react";
import {
  SetSyncInterval,
  useDefaultSyncInterval,
  useSyncIntervalOptions,
} from "@/lib/use-run-sync-operation-at-interval";
import { SyncDbTableName } from "@/schemas";

const FormSchema = z.object({
  interval: z.string(),
  customInterval: z.string().optional(),
});

export type IntervalSelectProps = {
  onRun: () => Promise<unknown>;
  dbTableName: SyncDbTableName;
  setSyncInterval: SetSyncInterval;
};

export function IntervalSelect(props: IntervalSelectProps) {
  const { onRun, setSyncInterval, dbTableName } = props;

  const syncIntervalOptions = useSyncIntervalOptions(dbTableName);
  const defaultValue = useDefaultSyncInterval(dbTableName);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      interval: syncIntervalOptions.find(
        (option) => option.value === defaultValue.toString(),
      )?.value as string,
      customInterval: (defaultValue / 1000).toString(),
    },
  });

  const intervalValue = form.watch("interval");
  const customIntervalValue = form.watch("customInterval");
  const isManual = intervalValue === "manual";
  const isCustom = intervalValue === "custom";

  useEffect(() => {
    // console.log("INTERVAL CHANGED: ", { intervalValue, customIntervalValue });
    if (!intervalValue) return;
    if (intervalValue === "manual") return setSyncInterval(null);
    if (isCustom && customIntervalValue)
      return setSyncInterval(parseInt(customIntervalValue) * 1000);

    const intervalNumber = parseInt(intervalValue);
    // console.log("intervalNumber: ", intervalNumber);
    setSyncInterval(intervalNumber);
    // if (intervalValue === "default" || intervalValue === "slow") {
    // }
  }, [intervalValue, customIntervalValue]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(console.log)}
        className="flex flex-1 gap-1"
      >
        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem
              className="w-[120px]"
              onClick={() => {
                console.log("form data: ", form.getValues());
              }}
            >
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {syncIntervalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {isManual && (
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => {
              onRun();
              // console.log("run sync query", operation.dbTableName);
            }}
          >
            Run
          </Button>
        )}
        {isCustom && (
          <FormField
            control={form.control}
            name="customInterval"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    placeholder="custom interval"
                    type="number"
                    className="w-[65px] px-0.5 text-center"
                    min={2}
                    {...field}
                  />
                </FormControl>
                <span className="absolute -bottom-1 left-3.5 text-[10px] text-muted-foreground">
                  seconds
                </span>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
