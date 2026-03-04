import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Info, Loader2, Navigation, MapPin } from "lucide-react";
import { StopPicker } from "@/components/StopPicker";
import { motion } from "motion/react";
import { useState, useEffect} from "react";
import { toast } from "sonner";
import type { Route } from "../backend.d";
import { useGetAllRoutes } from "../hooks/useQueries";
import { DEMO_ROUTES, findRouteForStops, getAllStops, DEMO_BUSES, getBusById, getRouteById } from "../utils/demoData";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase"; 
import { useSearch } from "@tanstack/react-router";

// Route stops with coordinates (latitude, longitude)
const ROUTE_STOPS = [
  { name: "Rajpuri", lat: 29.0596, lng: 75.8770 },
  { name: "Satgoli", lat: 29.0650, lng: 75.8820 },
  { name: "Masana", lat: 29.0720, lng: 75.8900 },
  { name: "Kheri Lakha Singh", lat: 29.0800, lng: 75.8950 },
  { name: "Sagri", lat: 29.0880, lng: 75.9020 },
  { name: "Topra Kalan", lat: 29.0960, lng: 75.9100 },
  { name: "Ismailpur", lat: 29.1040, lng: 75.9180 },
  { name: "Badanpuri", lat: 29.1120, lng: 75.9260 },
  { name: "Chhota Topra", lat: 29.1200, lng: 75.9340 },
];



/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 First latitude
 * @param lon1 First longitude
 * @param lat2 Second latitude
 * @param lon2 Second longitude
 * @returns Distance in meters
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the index of the nearest stop to the driver location
 * @param stops Array of stops with coordinates
 * @param lat Driver latitude
 * @param lng Driver longitude
 * @returns Index of the nearest stop
 */
function findNearestStopIndex(
  stops: typeof ROUTE_STOPS,
  lat: number,
  lng: number
): number {
  let nearestIndex = 0;
  let minDistance = Infinity;

  stops.forEach((stop, index) => {
    const distance = haversineDistance(lat, lng, stop.lat, stop.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

/**
 * Route Timeline Component - Shows all stops with real-time bus position
 */
function RouteTimeline({
  stops,
  currentStopIndex,
}: {
  stops: typeof ROUTE_STOPS;
  currentStopIndex: number | null;
}) {
  if (currentStopIndex === null) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        Waiting for bus location data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stops.map((stop, index) => {
        const isCompleted = index < currentStopIndex;
        const isCurrent = index === currentStopIndex;
        const isUpcoming = index > currentStopIndex;

        return (
          <motion.div
            key={stop.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-4"
          >
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? "bg-blue-500 ring-4 ring-blue-500/30 scale-110"
                    : isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
              >
                {isCurrent ? (
                  <span className="text-lg">🚌</span>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : null}
              </div>

              {/* Vertical line to next stop */}
              {index < stops.length - 1 && (
                <div
                  className={`w-1 h-12 transition-colors ${
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>

            {/* Stop info */}
            <div className="flex-grow pt-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.1 }}
              >
                <p
                  className={`font-semibold transition-colors ${
                    isCurrent
                      ? "text-blue-600 dark:text-blue-400 text-base"
                      : isCompleted
                        ? "text-gray-500 line-through"
                        : "text-foreground"
                  }`}
                >
                  {stop.name}
                </p>
                {isCurrent && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                    🚌 Bus is here
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function FindBusPage() {
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [currentStopIndex, setCurrentStopIndex] = useState<number | null>(null);
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Search terms used to filter options in the dropdowns
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const navigate = useNavigate();
  const { data: backendRoutes, isLoading } = useGetAllRoutes();
  const routes: Route[] = backendRoutes?.length ? backendRoutes : DEMO_ROUTES;
  const allStops = getAllStops(routes);

  const search = useSearch({ strict: false }) as { busId?: string };
  const busId = search?.busId;

  /**
   * Listen for real-time driver location updates from Firestore
   */
  useEffect(() => {
    if (!busId) return;

    const unsubscribe = onSnapshot(
      doc(db, "routes", busId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          const location = data.driverLocation as
            | { lat: number; lng: number }
            | undefined;

          if (location) {
            setDriverLocation({ lat: location.lat, lng: location.lng });

            // Calculate nearest stop based on driver location
            const nearestIndex = findNearestStopIndex(
              ROUTE_STOPS,
              location.lat,
              location.lng
            );
            setCurrentStopIndex(nearestIndex);
          }
        }
      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [busId]);

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

        {busId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6"
          >
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Live Bus Tracking
                </CardTitle>
                {driverLocation && (
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <RouteTimeline
                  stops={ROUTE_STOPS}
                  currentStopIndex={currentStopIndex}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="ghost" size="sm" className="px-2 py-1">
                        <span className="text-xs text-muted-foreground font-body">{route.stops[0]}</span>
                      </Button>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                      <Button variant="ghost" size="sm" className="px-2 py-1">
                        <span className="text-xs text-muted-foreground font-body">{route.stops[route.stops.length - 1]}</span>
                      </Button>
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
