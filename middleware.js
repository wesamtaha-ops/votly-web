export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/surveys",
    "/rewards",
    "/profile",
    "/edit-profile",
    "/complete-profile",
  ],
};
