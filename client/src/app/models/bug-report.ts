export interface BugReportListItem {
  id: number;
  receivedAt: string;
  buildVersion: string;
  platform: string;
  summary: string;
  reporterNote: string;
}

export interface BugReportDetail extends BugReportListItem{
  screenshotPath: string;
  hardwareStats: HardwareStats;
  payloadData: JsonObject;
  rawPayload: JsonObject;
}

export interface HardwareStats {
  cpu?: string;
  gpu?: string;
  ram?: {
    free: number;
    total: number;
  };
  display?: {
    size?: string;
    refresh?: number;
  };
}

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type JsonObject = Record<string, JsonValue>;
