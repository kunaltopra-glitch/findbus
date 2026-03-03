import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import StaffPage from "./pages/StaffPage";
import ETIMPage from "./pages/ETIMPage";
import TripStartedPage from "./pages/TripStartedPage";
import { AIBotPage } from "./pages/AIBotPage";
import { AdminPage } from "./pages/AdminPage";
import { BookTicketPage } from "./pages/BookTicketPage";
import { BusDetailsPage } from "./pages/BusDetailsPage";
import { BusTimingsPage } from "./pages/BusTimingsPage";
import { CustomerSupportPage } from "./pages/CustomerSupportPage";
import { FindBusPage } from "./pages/FindBusPage";
import { HomePage } from "./pages/HomePage";
import { PaymentPage } from "./pages/PaymentPage";

// ── Root route ─────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ── Layout route ───────────────────────────────────────
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

// ── Page routes ────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/home",
  component: HomePage,
});

const findBusRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/find-bus",
  component: FindBusPage,
});

const busTimingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bus-timings/$routeId",
  component: BusTimingsPage,
});

const busDetailsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bus-details/$busId",
  component: BusDetailsPage,
});

const bookTicketRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/book-ticket",
  component: BookTicketPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/payment/$busId",
  component: PaymentPage,
});

const aiBotRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai-bot",
  component: AIBotPage,
});

const customerSupportRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/customer-support",
  component: CustomerSupportPage,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin",
  component: AdminPage,
});

// ── Router ─────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  // Public routes: landing/login and special staff/etim flows
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: LoginPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/staff",
    component: StaffPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/etim",
    component: ETIMPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/trip-started",
    component: TripStartedPage,
  }),
  layoutRoute.addChildren([
    homeRoute,
    findBusRoute,
    busTimingsRoute,
    busDetailsRoute,
    bookTicketRoute,
    paymentRoute,
    aiBotRoute,
    customerSupportRoute,
    adminRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
