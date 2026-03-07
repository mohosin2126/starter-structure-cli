export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const studentRoutes: StarterRoute[] = [
  {
    path: "/student",
    label: "Student Home"
  },
  {
    path: "/student/create",
    label: "Student Create",
    permission: "student.create"
  },
  {
    path: "/student/view/:id",
    label: "Student Detail",
    permission: "student.read"
  }
];

export default studentRoutes;
