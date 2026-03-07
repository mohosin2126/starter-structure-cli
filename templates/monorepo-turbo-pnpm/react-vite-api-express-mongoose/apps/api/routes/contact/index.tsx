export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const contactApiRoutes: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/contact",
    handler: "listContact",
    protected: true
  },
  {
    method: "POST",
    path: "/contact",
    handler: "createContact",
    protected: true
  }
];

export default contactApiRoutes;
