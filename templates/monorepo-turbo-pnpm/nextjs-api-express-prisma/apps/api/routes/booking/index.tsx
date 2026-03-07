export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const bookingApiRoutes: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/booking",
    handler: "listBooking",
    protected: true
  },
  {
    method: "POST",
    path: "/booking",
    handler: "createBooking",
    protected: true
  }
];

export default bookingApiRoutes;
