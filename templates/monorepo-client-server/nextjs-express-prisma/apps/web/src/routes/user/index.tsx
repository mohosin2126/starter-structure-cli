export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const userRoutes: StarterRoute[] = [
  {
    path: "/user",
    label: "User Home"
  },
  {
    path: "/user/create",
    label: "User Create",
    permission: "user.create"
  },
  {
    path: "/user/view/:id",
    label: "User Detail",
    permission: "user.read"
  }
];

export default userRoutes;
