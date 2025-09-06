import  { lazy, Suspense } from "react";
import PageLoader from "../components/micros/PageLoader";
const Register = lazy(() => import("../pages/Register"));
const DashboardRoutes = lazy(() => import("../pages/DashboardRoutes"));
export const nav = [
    {
        path: "/",
        name: "register",
        element: (
            <Suspense fallback={<PageLoader/>}>
            <Register />
            </Suspense>
        ),
        isPrivate: false,
      },
       {
        path: "/*",
        name: "dashboard",
        element: (
            <Suspense fallback={<PageLoader/>}>
            <DashboardRoutes />
            </Suspense>
        ),
        isPrivate: true,
      }

]