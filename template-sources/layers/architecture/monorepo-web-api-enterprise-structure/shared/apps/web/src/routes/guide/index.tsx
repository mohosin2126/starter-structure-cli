export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const guideRoutes: StarterRoute[] = [
  {
    path: "/guide",
    label: "Guide Home"
  },
  {
    path: "/guide/create",
    label: "Guide Create",
    permission: "guide.create"
  },
  {
    path: "/guide/view/:id",
    label: "Guide Detail",
    permission: "guide.read"
  }
];

export default guideRoutes;
