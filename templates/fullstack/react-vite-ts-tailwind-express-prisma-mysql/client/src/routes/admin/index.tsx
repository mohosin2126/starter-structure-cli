export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const adminRoutes: StarterRoute[] = [
  {
    path: "/admin",
    label: "Admin Home"
  },
  {
    path: "/admin/create",
    label: "Admin Create",
    permission: "admin.create"
  },
  {
    path: "/admin/view/:id",
    label: "Admin Detail",
    permission: "admin.read"
  }
];

export default adminRoutes;
