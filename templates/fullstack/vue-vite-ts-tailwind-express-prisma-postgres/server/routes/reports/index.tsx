export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const reportsApiRoutes: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/reports",
    handler: "listReports",
    protected: true
  },
  {
    method: "POST",
    path: "/reports",
    handler: "createReports",
    protected: true
  }
];

export default reportsApiRoutes;
