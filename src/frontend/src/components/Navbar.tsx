import { Link, useLocation } from "@tanstack/react-router";
import { Bus, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
            <div className="w-9 h-9 rounded-lg bg-[oklch(0.72_0.21_50)] flex items-center justify-center shadow-md group-hover:bg-[oklch(0.78_0.21_52)] transition-colors">
              <Bus className="w-5 h-5 text-white" />
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
