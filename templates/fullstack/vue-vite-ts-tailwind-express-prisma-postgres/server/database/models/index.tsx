export interface ModuleModelRecord {
  id: string;
  name: string;
  status: "draft" | "active";
  createdAt: string;
}

export const modelsFields = [
  "id",
  "name",
  "status",
  "createdAt"
];

export default modelsFields;
