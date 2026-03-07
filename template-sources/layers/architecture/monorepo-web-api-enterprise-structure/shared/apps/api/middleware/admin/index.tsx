export type AccessContext = {
  role?: string;
  permissions?: string[];
};

export function requireAdmin(context: AccessContext) {
  if (!context.role) {
    return {
      allowed: false,
      reason: "Missing authenticated role."
    };
  }

  return {
    allowed: true,
    reason: "Admin access granted."
  };
}

export default requireAdmin;
