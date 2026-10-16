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
