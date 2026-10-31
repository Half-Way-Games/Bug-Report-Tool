export interface BugReportListItem {
  id: number;
  received_at: string;
  build_version: string;
  platform: string;
  summary: string;
  reporter_note: string;
}

export interface BugReportDetail extends BugReportListItem{
  screenshot_path: string;
  hardware_stats: HardwareStats;
  payload_data: JsonObject;
  raw_payload: JsonObject;
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
