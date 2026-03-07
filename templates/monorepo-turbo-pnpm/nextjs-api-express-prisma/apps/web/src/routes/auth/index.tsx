export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const authRoutes: StarterRoute[] = [
  {
    path: "/auth",
    label: "Auth Home"
  },
  {
    path: "/auth/create",
    label: "Auth Create",
    permission: "auth.create"
  },
  {
    path: "/auth/view/:id",
    label: "Auth Detail",
    permission: "auth.read"
  }
];

export default authRoutes;
