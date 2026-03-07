export type EnvStatus = "draft" | "active" | "archived";

export interface EnvRecord {
  id: string;
  title: string;
  description: string;
  status: EnvStatus;
}

export interface EnvFilter {
  search?: string;
  status?: EnvStatus;
}
