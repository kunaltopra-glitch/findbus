import { Link } from "@tanstack/react-router";
import { Bus, ChevronRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[oklch(0.14_0.08_264)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="mb-4 inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.72_0.21_50)]">
              <Bus className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold">
              Bus <span className="text-[oklch(0.82_0.18_55)]">Connect</span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-white/65">
            A simpler way to explore routes, compare scheduled departures, and
            plan your next bus journey.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
            Explore
          </h2>
          <div className="space-y-3 text-sm text-white/65">
            <Link
              to="/find-bus"
              className="flex items-center gap-2 hover:text-white"
            >
              <ChevronRight className="h-3.5 w-3.5" /> Find a bus
            </Link>
            <Link
              to="/book-ticket"
              className="flex items-center gap-2 hover:text-white"
            >
              <ChevronRight className="h-3.5 w-3.5" /> Book a ticket
            </Link>
            <Link
              to="/ai-bot"
              className="flex items-center gap-2 hover:text-white"
            >
              <ChevronRight className="h-3.5 w-3.5" /> Travel assistant
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
            Need a hand?
          </h2>
          <p className="mb-3 text-sm leading-6 text-white/65">
            Visit the help centre for answers about routes and the booking demo.
          </p>
          <Link
            to="/customer-support"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[oklch(0.82_0.18_55)] hover:text-white"
          >
            Customer support <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <span>
            © {new Date().getFullYear()} Bus Connect. Demo experience.
          </span>
          <span>Designed by Kunal Pandit</span>
        </div>
      </div>
    </footer>
  );
}
