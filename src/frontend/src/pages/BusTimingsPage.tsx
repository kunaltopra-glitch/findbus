import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bus,
  Clock,
  MapPin,
  Navigation,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";
import type { BusTiming, Route } from "../backend.d";
import { useGetAllRoutes, useGetTimingsByRoute } from "../hooks/useQueries";
import {
  DEMO_BUSES,
  DEMO_ROUTES,
  DEMO_TIMINGS,
  formatTime,
  getBusById,
  getRouteById,
} from "../utils/demoData";

export function BusTimingsPage() {
  const { routeId } = useParams({ from: "/layout/bus-timings/$routeId" });
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { mode?: string };
  const isBookMode = search?.mode === "book";

  const { data: backendRoutes } = useGetAllRoutes();
  const routes: Route[] = backendRoutes?.length ? backendRoutes : DEMO_ROUTES;
  const route = getRouteById(routeId, routes);

  const { data: backendTimings, isLoading } = useGetTimingsByRoute(routeId);
  const timings: BusTiming[] = backendTimings?.length
    ? backendTimings
    : DEMO_TIMINGS.filter((t) => t.routeId === routeId);

<<<<<<< HEAD
  // Sort timings so the next upcoming departures (relative to now) appear first.
  // If a departure time has already passed today, treat it as the next-day occurrence
  // so it appears after today's upcoming departures.
  const sortedTimings = timings.slice().sort((a, b) => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const aMs = Number(a.departureTime) / 1_000_000;
    const bMs = Number(b.departureTime) / 1_000_000;
    const aDelta = aMs >= now ? aMs - now : aMs - now + day;
    const bDelta = bMs >= now ? bMs - now : bMs - now + day;
    return aDelta - bDelta;
  });

=======
>>>>>>> 4aacf40c7b67875eba6f1810d36f2cf96fc0f7f6
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero py-14 roadway-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: isBookMode ? "/book-ticket" : "/find-bus",
                })
              }
              className="flex items-center gap-2 text-[oklch(0.75_0.04_250)] hover:text-white transition-colors font-body text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {isBookMode ? "Book Ticket" : "Find Bus"}
            </button>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Bus className="w-3.5 h-3.5 text-[oklch(0.82_0.18_55)]" />
              <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold uppercase tracking-wider">
                Bus Timings
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-blue-300 mb-2">
              {route?.name ?? "Route Timings"}
            </h1>
            {route && (
              <div className="flex items-center gap-2 flex-wrap">
                {route.stops.map((stop, idx) => (
                  <span key={stop} className="flex items-center gap-2">
<<<<<<< HEAD
                    <span className="flex items-center gap-1 font-body text-sm text-[oklch(0.72_0.21_50)]">
                          <MapPin className="w-3 h-3 text-[oklch(0.72_0.21_50)]" />
                          {stop}
                        </span>
=======
                    <span className="flex items-center gap-1 text-blue-100 font-body text-sm">
                      <MapPin className="w-3 h-3 text-[oklch(0.72_0.21_50)]" />
                      {stop}
                    </span>
>>>>>>> 4aacf40c7b67875eba6f1810d36f2cf96fc0f7f6
                    {idx < route.stops.length - 1 && (
                      <span className="text-[oklch(0.5_0.04_250)]">→</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Timings List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : timings.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-2">
              No Timings Found
            </h3>
            <p className="text-muted-foreground font-body text-sm">
              No bus timings available for this route.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
<<<<<<< HEAD
            {sortedTimings.map((timing, idx) => (
=======
            {timings.map((timing, idx) => (
>>>>>>> 4aacf40c7b67875eba6f1810d36f2cf96fc0f7f6
              <TimingCard
                key={timing.id}
                timing={timing}
                idx={idx}
                isBookMode={isBookMode}
                route={route}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TimingCard({
  timing,
  idx,
  isBookMode,
  route,
}: {
  timing: BusTiming;
  idx: number;
  isBookMode: boolean;
  route: Route | undefined;
}) {
  const navigate = useNavigate();
  const bus = getBusById(timing.busId, DEMO_BUSES);

  const statusColors: Record<string, string> = {
    OnTime:
      "bg-[oklch(0.92_0.08_145)] text-[oklch(0.35_0.12_145)] border-[oklch(0.7_0.12_145/0.3)]",
    Delayed:
      "bg-[oklch(0.93_0.1_60)] text-[oklch(0.45_0.15_50)] border-[oklch(0.7_0.15_55/0.3)]",
    Cancelled:
      "bg-[oklch(0.93_0.08_25)] text-[oklch(0.45_0.2_27)] border-[oklch(0.6_0.18_27/0.3)]",
  };

  const status = bus?.status ?? "OnTime";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
    >
      <Card className="shadow-md border-border hover:border-[oklch(0.72_0.21_50/0.4)] transition-all group">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Bus Icon + Number */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[oklch(0.28_0.12_264/0.1)] flex items-center justify-center shrink-0">
                <Bus className="w-6 h-6 text-[oklch(0.38_0.12_264)]" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground text-base">
                  {bus?.busNumber ?? timing.busId}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {bus?.busType ?? "Standard Bus"}
                </p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.28_0.12_264/0.1)] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[oklch(0.38_0.12_264)]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body">
                    Departure
                  </p>
                  <p className="font-display font-semibold text-foreground">
                    {formatTime(timing.departureTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.21_50/0.1)] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[oklch(0.65_0.18_50)]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body">
                    Arrival
                  </p>
                  <p className="font-display font-semibold text-foreground">
                    {formatTime(timing.arrivalTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status + Actions */}
            <div className="flex flex-col gap-2 items-start sm:items-end">
              <Badge
                className={`text-xs font-body font-medium border ${statusColors[String(status)] ?? statusColors.OnTime}`}
              >
                {String(status)}
              </Badge>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="font-body text-xs border-[oklch(0.28_0.12_264/0.4)] text-[oklch(0.38_0.12_264)] hover:bg-[oklch(0.28_0.12_264/0.08)]"
                  onClick={() =>
                    navigate({
                      to: `/bus-details/${timing.busId}`,
                      search: { mode: "track" },
                    })
                  }
                  disabled={String(status) === "Cancelled"}
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Track Bus
                </Button>
                {isBookMode && (
                  <Button
                    size="sm"
                    className="gradient-orange text-white font-body text-xs border-0 hover:opacity-90"
                    onClick={() =>
                      navigate({
                        to: `/payment/${timing.busId}`,
                        search: {
                          timingId: timing.id,
                          fromStop: route?.fromStop ?? "",
                          toStop: route?.toStop ?? "",
                        },
                      })
                    }
                    disabled={String(status) === "Cancelled"}
                  >
                    <Ticket className="w-3 h-3 mr-1" />
                    Book
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
