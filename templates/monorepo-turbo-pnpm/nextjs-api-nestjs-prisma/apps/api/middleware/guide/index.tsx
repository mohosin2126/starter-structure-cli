export type AccessContext = {
  role?: string;
  permissions?: string[];
};

export function requireGuide(context: AccessContext) {
  if (!context.role) {
    return {
      allowed: false,
      reason: "Missing authenticated role."
    };
  }

  return {
    allowed: true,
    reason: "Guide access granted."
  };
}

export default requireGuide;
