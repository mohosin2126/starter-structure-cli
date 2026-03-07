export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const categoryApiRoutes: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/category",
    handler: "listCategory",
    protected: true
  },
  {
    method: "POST",
    path: "/category",
    handler: "createCategory",
    protected: true
  }
];

export default categoryApiRoutes;
