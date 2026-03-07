export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const homeRoutes: StarterRoute[] = [
  {
    path: "/home",
    label: "Home Home"
  },
  {
    path: "/home/create",
    label: "Home Create",
    permission: "home.create"
  },
  {
    path: "/home/view/:id",
    label: "Home Detail",
    permission: "home.read"
  }
];

export default homeRoutes;
