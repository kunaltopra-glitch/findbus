import { Link, useLocation, useNavigate } from "@tanstack/react-router";
const logo = "/icon.jpg";
import { Bus, Menu, X, LogOut, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/find-bus", label: "Find Bus" },
  { href: "/book-ticket", label: "Book Ticket" },
  { href: "/ai-bot", label: "AI Bot" },
  { href: "/customer-support", label: "Customer Support" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProfileOpen(false);
      // redirect user back to login page after signing out
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.24_0.14_264/0.97)] nav-blur shadow-lg"
          : "bg-[oklch(0.22_0.13_264)]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shadow-md group-hover:opacity-90 transition-opacity">
              <img src={logo} alt="FindBus logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-white font-display font-bold text-xl tracking-tight">
                Find<span className="text-[oklch(0.82_0.18_55)]">Bus</span>
              </span>
              <p className="text-[oklch(0.75_0.04_250)] text-[10px] font-body leading-none tracking-wider uppercase">
                Haryana Roadways
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 text-sm font-body font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? "text-[oklch(0.82_0.18_55)] bg-white/10"
                      : "text-[oklch(0.85_0.02_250)] hover:text-white hover:bg-white/8"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[oklch(0.82_0.18_55)] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Profile Button */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                  aria-label="User profile"
                >
                  <User className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-[oklch(0.24_0.14_264/0.97)] border border-white/20 rounded-lg shadow-lg p-2 z-50"
                    >
                      <div className="px-3 py-2 text-xs text-[oklch(0.85_0.02_250)] border-b border-white/10">
                        {user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-body font-medium rounded-md bg-[oklch(0.72_0.21_50)] text-white hover:bg-[oklch(0.78_0.21_52)] transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[oklch(0.2_0.13_264)] border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-body font-medium transition-colors ${
                      isActive
                        ? "bg-[oklch(0.72_0.21_50)] text-white"
                        : "text-[oklch(0.85_0.02_250)] hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user ? (
                <div className="pt-3 border-t border-white/10">
                  <div className="px-4 py-2 text-xs text-[oklch(0.85_0.02_250)]">
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-lg text-sm font-body font-medium bg-[oklch(0.72_0.21_50)] text-white hover:bg-[oklch(0.78_0.21_52)] transition-colors mt-2"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
