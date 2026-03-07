export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const studentApiRoutes: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/student",
    handler: "listStudent",
    protected: true
  },
  {
    method: "POST",
    path: "/student",
    handler: "createStudent",
    protected: true
  }
];

export default studentApiRoutes;
