import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Info, Loader2, MapPin, Navigation, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Route } from "../backend.d";
import { useGetAllRoutes } from "../hooks/useQueries";
import { DEMO_ROUTES, findRouteForStops, getAllStops } from "../utils/demoData";

function StopPicker({
  value,
  onChange,
  options,
  placeholder,
  search,
  setSearch,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  search: string;
  setSearch: (s: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`font-body h-11 flex items-center justify-between gap-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="text-left">
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-2">
        <div className="p-1">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search stops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-input rounded px-2 py-1 text-sm"
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>

          <div className="max-h-48 overflow-auto">
            {options.length ? (
              options.map((stop) => (
                <button
                  key={stop}
                  type="button"
                  onClick={() => {
                    onChange(stop);
                    setOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-2 py-1 rounded hover:bg-accent"
                >
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm">{stop}</span>
                </button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground p-2">No stops</div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function FindBusPage() {
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  // search terms used to filter options in the dropdowns
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const navigate = useNavigate();

  const { data: backendRoutes, isLoading } = useGetAllRoutes();
  const routes: Route[] = backendRoutes?.length ? backendRoutes : DEMO_ROUTES;
  const allStops = getAllStops(routes);

  const toStops = fromStop
    ? routes
        .filter((r) => r.stops.includes(fromStop))
        .flatMap((r) => r.stops.slice(r.stops.indexOf(fromStop) + 1))
        .filter((v, i, a) => a.indexOf(v) === i)
    : allStops;

  // apply search filters to the available stop lists
  const filteredFromStops = allStops.filter((stop) =>
    stop.toLowerCase().includes(fromSearch.toLowerCase()),
  );
  const filteredToStops = toStops.filter((stop) =>
    stop.toLowerCase().includes(toSearch.toLowerCase()),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fromStop || !toStop) {
      toast.error("Please select both From and To stops.");
      return;
    }
    const route = findRouteForStops(fromStop, toStop, routes);
    if (!route) {
      toast.error("No direct route found between these stops.");
      return;
    }
    navigate({ to: `/bus-timings/${route.id}` });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="gradient-hero py-14 roadway-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Navigation className="w-3.5 h-3.5 text-[oklch(0.82_0.18_55)]" />
              <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold uppercase tracking-wider">
                Route Search
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-blue-300 mb-3">
              Find Your Bus
            </h1>
            <p className="text-[oklch(0.75_0.04_250)] font-body max-w-xl mx-auto">
              Search for live bus timings and track your Haryana Roadways bus on
              any route.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-xl border-border">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl text-foreground">
                Select Your Route
              </CardTitle>
              {isLoading && (
                <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading routes from server...
                </p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* From Stop */}
                <div className="space-y-2">
                  <span className="text-sm font-body font-medium text-foreground flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.28_0.12_264)]" />
                    From Stop
                  </span>
                  <StopPicker
                    value={fromStop}
                    onChange={(v) => {
                      setFromStop(v);
                      setToStop("");
                      setFromSearch("");
                      setToSearch("");
                    }}
                    options={filteredFromStops}
                    placeholder="Select departure stop"
                    search={fromSearch}
                    setSearch={setFromSearch}
                  />
                </div>

                {/* Arrow divider */}
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-border" />
                  <div className="mx-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* To Stop */}
                <div className="space-y-2">
                  <span className="text-sm font-body font-medium text-foreground flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.72_0.21_50)]" />
                    To Stop
                  </span>
                  <StopPicker
                    value={toStop}
                    onChange={(v) => setToStop(v)}
                    options={filteredToStops}
                    placeholder={
                      fromStop ? "Select destination stop" : "Select From stop first"
                    }
                    search={toSearch}
                    setSearch={setToSearch}
                    disabled={!fromStop}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-orange text-white font-body font-semibold border-0 hover:opacity-90 h-12"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Search Buses
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Available Routes */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display font-semibold text-base text-foreground">
              Available Routes
            </h2>
          </div>
          <div className="grid gap-3">
            {routes.map((route, idx) => (
              <motion.button
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                onClick={() => navigate({ to: `/bus-timings/${route.id}` })}
                className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-[oklch(0.72_0.21_50/0.5)] hover:bg-[oklch(0.72_0.21_50/0.04)] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-foreground group-hover:text-[oklch(0.65_0.18_50)]">
                      {route.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {route.stops.map((stop, sIdx) => (
                        <span key={stop} className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground font-body">
                            {stop}
                          </span>
                          {sIdx < route.stops.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[oklch(0.72_0.21_50)] transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
