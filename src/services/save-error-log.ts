import { service } from "@/lib/service";

/**
 * NOT EXPORTED IN ANY ROUTE.
 * Instead, it is used inside the trpc error formatter
 */

import { z } from "zod";
import fs from "fs";
import path from "path";

const logsFilePath = path.join(process.cwd(), "LOGS.TXT");

export const saveErrorLog = service()
  .input({
    message: z.string().default("UNKNOWN").optional(),
    statusCode: z.string().default("UNKNOWN").optional(),
    path: z.string().default("UNKNOWN").optional(),
  })
  .mutation(async ({ ctx, input }) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [live-results] [${input.path}] [${input.statusCode}] ${input.message}\n`;

    // Write the log message to the local file
    fs.appendFile(logsFilePath, logMessage, (err) => {
      if (err) {
        console.error("Failed to write error log to file:", err);
      }
    });

    try {
      // Insert the log into the database
      await ctx.mysqlRemoteDb?.query(
        `
      INSERT INTO \`dbo.Logs\` (LogTime, LogService, LogMessage, LogStatusCode, LogPath)
      VALUES (NOW(), 'live-results', ?, ?, ?)
    `,
        [input.message, input.statusCode, input.path],
      );
    } catch (error) {
      console.error("Failed to insert error log into database:", error);
    }
  });
