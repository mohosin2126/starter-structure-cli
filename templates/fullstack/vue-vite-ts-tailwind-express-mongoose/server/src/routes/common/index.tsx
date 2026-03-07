export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const commonApiRoutes: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/common",
    handler: "listCommon",
    protected: true
  },
  {
    method: "POST",
    path: "/common",
    handler: "createCommon",
    protected: true
  }
];

export default commonApiRoutes;
