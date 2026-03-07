export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const adminApiRoutes: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/admin",
    handler: "listAdmin",
    protected: true
  },
  {
    method: "POST",
    path: "/admin",
    handler: "createAdmin",
    protected: true
  }
];

export default adminApiRoutes;
