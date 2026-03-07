export type TypesStatus = "draft" | "active" | "archived";

export interface TypesRecord {
  id: string;
  title: string;
  description: string;
  status: TypesStatus;
}

export interface TypesFilter {
  search?: string;
  status?: TypesStatus;
}
