import { Toaster } from "@/components/ui/sonner";
import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

export function Layout() {
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // If not authenticated and not already on /login, redirect to login
      if (!user && loc.current.pathname !== "/login") {
        navigate({ to: "/login" });
        return;
      }

      // If authenticated, fetch role and if Staff/ETIM force to their pages
      if (user) {
        (async () => {
          try {
            const uref = doc(db, "users", user.uid);
            const snap = await getDoc(uref);
            const role = snap.exists() ? (snap.data() as any).role : null;
            if (role === "Staff" && loc.current.pathname !== "/staff") {
              navigate({ to: "/staff" });
            }
            if (role === "ETIM" && loc.current.pathname !== "/etim") {
              navigate({ to: "/etim" });
            }
          } catch (e) {
            // ignore
          }
        })();
      }
    });
    return () => unsub();
  }, [navigate, loc]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
