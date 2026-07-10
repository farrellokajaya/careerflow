export const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/privacy",
  "/terms",
] as const;

export const protectedRoutes = [
  "/dashboard",
  "/applications",
  "/companies",
  "/interviews",
  "/documents",
  "/analytics",
  "/notifications",
  "/settings",
] as const;

export const adminRoutes = ["/admin"] as const;
