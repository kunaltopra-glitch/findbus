import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bus,
  CheckCircle2,
  Clock,
  Gauge,
  MapPin,
  Ticket,
  Timer,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useGetBusDetails } from "../hooks/useQueries";
import { useUpdateBusPosition } from "../hooks/useQueries";
import {
  DEMO_BUSES,
  DEMO_ROUTES,
  getBusById,
  getRouteById,
} from "../utils/demoData";

export function BusDetailsPage() {
  const { busId } = useParams({ from: "/layout/bus-details/$busId" });
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    mode?: string;
    fromStop?: string;
    toStop?: string;
    timingId?: string;
  };
  const isBookMode = search?.mode === "book";

  // Try backend, fallback to demo
  const { data: backendBus, isLoading } = useGetBusDetails(busId);
  const demoBus = getBusById(busId, DEMO_BUSES);
  const bus = backendBus ?? demoBus;

  const route = getRouteById(bus?.routeId ?? "", DEMO_ROUTES);

  const [currentStop, setCurrentStop] = useState<number>(
    Number(bus?.currentStopIndex ?? 0),
  );
  const [speed, setSpeed] = useState(bus?.speed ?? 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { mutate: updatePosition } = useUpdateBusPosition();

  // Sync currentStop when bus data loads
  useEffect(() => {
    if (bus) {
      setCurrentStop(Number(bus.currentStopIndex));
      setSpeed(bus.speed);
    }
  }, [bus]);

  // Animate bus position
  useEffect(() => {
    if (!route || String(bus?.status) === "Cancelled") return;

    intervalRef.current = setInterval(() => {
      setCurrentStop((prev) => {
        const next = prev < route.stops.length - 1 ? prev + 1 : prev;
        if (next !== prev) {
          // Update speed slightly
          setSpeed(Math.floor(Math.random() * 20 + 50));
          // Call backend (best-effort)
          updatePosition({ busId, currentStopIndex: BigInt(next) });
        }
        return next;
      });
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [busId, route, bus?.status, updatePosition]);

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: typeof CheckCircle2 }
  > = {
    OnTime: {
      label: "On Time",
      color:
        "bg-[oklch(0.92_0.08_145)] text-[oklch(0.35_0.12_145)] border-[oklch(0.7_0.12_145/0.3)]",
      icon: CheckCircle2,
    },
    Delayed: {
      label: "Delayed",
      color:
        "bg-[oklch(0.93_0.1_60)] text-[oklch(0.45_0.15_50)] border-[oklch(0.7_0.15_55/0.3)]",
      icon: Timer,
    },
    Cancelled: {
      label: "Cancelled",
      color:
        "bg-[oklch(0.93_0.08_25)] text-[oklch(0.45_0.2_27)] border-[oklch(0.6_0.18_27/0.3)]",
      icon: AlertCircle,
    },
  };

  const statusKey = String(bus?.status ?? "OnTime");
  const statusCfg = statusConfig[statusKey] ?? statusConfig.OnTime;
  const StatusIcon = statusCfg.icon;

  if (isLoading && !bus) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-64 rounded-2xl mb-6" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display font-semibold text-foreground mb-2">
            Bus Not Found
          </h2>
          <Button onClick={() => navigate({ to: "/find-bus" })}>
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate({ to: -1 as never })}
              className="flex items-center gap-2 text-[oklch(0.75_0.04_250)] hover:text-white transition-colors font-body text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-3">
                  <Bus className="w-3.5 h-3.5 text-[oklch(0.82_0.18_55)]" />
                  <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold uppercase tracking-wider">
                    Live Bus Details
                  </span>
                </div>
                <h1 className="font-display font-extrabold text-3xl text-blue-300">
                  {bus.busNumber}
                </h1>
                <p className="text-blue-100 font-body mt-1">
                  {route?.name ?? "Route Details"}
                </p>
              </div>
              <Badge
                className={`text-sm font-body font-medium border ${statusCfg.color} flex items-center gap-1.5 py-1.5 px-3`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusCfg.label}
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Bus Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Bus className="w-4 h-4 text-[oklch(0.38_0.12_264)]" />
                Bus Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InfoItem
                  icon={Bus}
                  label="Bus Number"
                  value={bus.busNumber}
                  highlight
                />
                <InfoItem icon={User} label="Driver ID" value={bus.driverID} />
                <InfoItem
                  icon={User}
                  label="Conductor ID"
                  value={bus.conductorID}
                />
                <InfoItem icon={Bus} label="Bus Type" value={bus.busType} />
                <InfoItem
                  icon={Gauge}
                  label="Current Speed"
                  value={`${speed} km/h`}
                  highlight
                />
                <InfoItem
                  icon={Clock}
                  label="ETA (Destination)"
                  value={route ? getETA(currentStop, route.stops) : "—"}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Route Timeline */}
        {route && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[oklch(0.72_0.21_50)]" />
                  Live Route Tracking
                  <span className="ml-auto flex items-center gap-1 text-xs text-[oklch(0.58_0.12_145)] font-body font-medium bg-[oklch(0.92_0.08_145)] px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.58_0.12_145)] pulse-dot" />
                    Live
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-4 bottom-4 w-0.5 bus-route-line rounded-full" />

                  <div className="space-y-0">
                    {route.stops.map((stop, idx) => {
                      const isCurrentStop = idx === currentStop;
                      const isPassed = idx < currentStop;
                      const isDestination = idx === route.stops.length - 1;

                      return (
                        <div
                          key={stop}
                          className="relative flex items-start gap-4 py-3"
                        >
                          {/* Stop dot */}
                          <div className="relative z-10 shrink-0">
                            {isCurrentStop ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="w-10 h-10 rounded-full bg-[oklch(0.72_0.21_50)] border-4 border-[oklch(0.88_0.12_55)] flex items-center justify-center shadow-lg"
                              >
                                <span className="text-lg">🚌</span>
                              </motion.div>
                            ) : (
                              <div
                                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center text-sm ${
                                  isPassed
                                    ? "bg-[oklch(0.58_0.12_145)] border-[oklch(0.75_0.12_145)] text-white"
                                    : isDestination
                                      ? "bg-[oklch(0.72_0.21_50/0.2)] border-[oklch(0.72_0.21_50/0.5)]"
                                      : "bg-secondary border-border"
                                }`}
                              >
                                {isPassed ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : isDestination ? (
                                  <MapPin className="w-4 h-4 text-[oklch(0.65_0.18_50)]" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Stop details */}
                          <div className="flex-1 flex items-center justify-between pt-2">
                            <div>
                              <p
                                className={`font-display font-semibold ${
                                  isCurrentStop
                                    ? "text-[oklch(0.65_0.18_50)] text-base"
                                    : isPassed
                                      ? "text-muted-foreground text-sm"
                                      : "text-foreground text-sm"
                                }`}
                              >
                                {stop}
                              </p>
                              {isCurrentStop && (
                                <p className="text-xs text-[oklch(0.72_0.21_50)] font-body font-medium">
                                  Bus is here
                                </p>
                              )}
                              {isDestination && !isCurrentStop && (
                                <p className="text-xs text-muted-foreground font-body">
                                  Destination
                                </p>
                              )}
                            </div>
                            {isPassed && (
                              <span className="text-xs text-muted-foreground font-body bg-secondary px-2 py-0.5 rounded-full">
                                Passed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Book Ticket CTA */}
        {isBookMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-[oklch(0.72_0.21_50/0.3)] bg-[oklch(0.72_0.21_50/0.05)] shadow-md">
              <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    Ready to Book?
                  </h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Secure your seat on this bus
                  </p>
                </div>
                <Button
                  className="gradient-orange text-white font-body font-semibold border-0 hover:opacity-90"
                  onClick={() =>
                    navigate({
                      to: `/payment/${busId}`,
                      search: {
                        fromStop: search?.fromStop ?? route?.fromStop ?? "",
                        toStop: search?.toStop ?? route?.toStop ?? "",
                        timingId: search?.timingId ?? "",
                      },
                    })
                  }
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Proceed to Book
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          highlight ? "bg-[oklch(0.72_0.21_50/0.15)]" : "bg-secondary"
        }`}
      >
        <Icon
          className={`w-4 h-4 ${highlight ? "text-[oklch(0.65_0.18_50)]" : "text-muted-foreground"}`}
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-body">{label}</p>
        <p
          className={`font-body font-semibold text-sm ${highlight ? "text-[oklch(0.55_0.2_50)]" : "text-foreground"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function getETA(currentIdx: number, stops: string[]): string {
  // Ensure stops are in correct order (ascending indices)
  const remaining = stops.length - 1 - currentIdx;
  if (remaining <= 0) return "Arrived";
  
  // Calculate approximate time: 35 minutes per remaining stop
  const minutes = remaining * 35;
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
