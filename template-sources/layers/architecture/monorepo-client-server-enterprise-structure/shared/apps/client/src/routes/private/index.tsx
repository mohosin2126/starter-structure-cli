export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const privateRoutes: StarterRoute[] = [
  {
    path: "/private",
    label: "Private Home"
  },
  {
    path: "/private/create",
    label: "Private Create",
    permission: "private.create"
  },
  {
    path: "/private/view/:id",
    label: "Private Detail",
    permission: "private.read"
  }
];

export default privateRoutes;
