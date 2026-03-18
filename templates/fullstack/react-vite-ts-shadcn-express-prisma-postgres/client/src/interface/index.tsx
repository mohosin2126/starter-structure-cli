export type InterfaceStatus = "draft" | "active" | "archived";

export interface InterfaceRecord {
  id: string;
  title: string;
  description: string;
  status: InterfaceStatus;
}

export interface InterfaceFilter {
  search?: string;
  status?: InterfaceStatus;
}
