import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Info, MapPin, Ticket, Search } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Route } from "../backend.d";
import { useGetAllRoutes } from "../hooks/useQueries";
import { DEMO_ROUTES, findRouteForStops, getAllStops, getDestinationsFromStop } from "../utils/demoData";

const TICKET_BENEFITS = [
  "Instant digital ticket on payment",
  "No queue at bus stand",
  "Seat guaranteed on booking",
  "Easy cancellation within 1 hour",
];

export function BookTicketPage() {
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const fromSearchRef = useRef<HTMLInputElement>(null);
  const toSearchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: backendRoutes } = useGetAllRoutes();
  const routes: Route[] = backendRoutes?.length ? backendRoutes : DEMO_ROUTES;
  const allStops = getAllStops(routes);

  const toStops = fromStop ? getDestinationsFromStop(fromStop, routes) : allStops;

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
    navigate({
      to: `/bus-timings/${route.id}`,
      search: { mode: "book" },
    });
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
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Ticket className="w-3.5 h-3.5 text-[oklch(0.82_0.18_55)]" />
              <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold uppercase tracking-wider">
                Digital Ticketing
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
              Book Your Ticket
            </h1>
            <p className="text-[oklch(0.75_0.04_250)] font-body max-w-xl mx-auto">
              Select your route and choose from available buses. Pay online and
              get your digital ticket instantly.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-border">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl text-foreground">
                  Select Your Route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-sm font-body font-medium text-foreground flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.28_0.12_264)]" />
                      From Stop
                    </span>
                    <Select
                      value={fromStop}
                      onValueChange={(v) => {
                        setFromStop(v);
                        setToStop("");
                        setFromSearch("");
                        setToSearch("");
                      }}
                      onOpenChange={(open) => {
                        if (open) {
                          setTimeout(() => fromSearchRef.current?.focus(), 0);
                        }
                      }}
                    >
                      <SelectTrigger className="font-body h-11">
                        <SelectValue placeholder="Select boarding stop" />
                      </SelectTrigger>
                      <SelectContent>
                        <div 
                          className="p-2"
                          onMouseDown={(e) => e.preventDefault()}
                          onPointerDown={(e) => e.preventDefault()}
                        >
                          <div className="relative">
                            <input
                              ref={fromSearchRef}
                              type="text"
                              placeholder="Search stops..."
                              value={fromSearch}
                              onChange={(e) => setFromSearch(e.target.value)}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                              onKeyUp={(e) => e.stopPropagation()}
                              className="w-full border border-input rounded px-2 py-1 text-sm"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          </div>
                        </div>
                        {filteredFromStops.map((stop) => (
                          <SelectItem
                            key={stop}
                            value={stop}
                            className="font-body"
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                              {stop}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex-1 h-px bg-border" />
                    <div className="mx-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-body font-medium text-foreground flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.72_0.21_50)]" />
                      To Stop
                    </span>
                    <Select
                      value={toStop}
                      onValueChange={setToStop}
                      disabled={!fromStop}
                      onOpenChange={(open) => {
                        if (open) {
                          setTimeout(() => toSearchRef.current?.focus(), 0);
                        }
                      }}
                    >
                      <SelectTrigger className="font-body h-11">
                        <SelectValue
                          placeholder={
                            fromStop
                              ? "Select destination"
                              : "Select From stop first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <div 
                          className="p-2"
                          onMouseDown={(e) => e.preventDefault()}
                          onPointerDown={(e) => e.preventDefault()}
                        >
                          <div className="relative">
                            <input
                              ref={toSearchRef}
                              type="text"
                              placeholder="Search stops..."
                              value={toSearch}
                              onChange={(e) => setToSearch(e.target.value)}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                              onKeyUp={(e) => e.stopPropagation()}
                              className="w-full border border-input rounded px-2 py-1 text-sm"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          </div>
                        </div>
                        {filteredToStops.map((stop) => (
                          <SelectItem
                            key={stop}
                            value={stop}
                            className="font-body"
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[oklch(0.72_0.21_50)]" />
                              {stop}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-orange text-white font-body font-semibold border-0 hover:opacity-90 h-12"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Find Available Buses
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-[oklch(0.72_0.21_50)]" />
                  Why Book Online?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {TICKET_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[oklch(0.92_0.08_145)] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[oklch(0.45_0.12_145)] text-xs">
                        ✓
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-snug">
                      {benefit}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="gradient-hero border-0 text-white">
              <CardContent className="p-5">
                <p className="font-display font-bold text-lg mb-1">₹150</p>
                <p className="text-[oklch(0.78_0.04_250)] text-xs font-body mb-3">
                  Standard fare (demo pricing)
                </p>
                <div className="text-xs text-[oklch(0.7_0.04_250)] font-body space-y-1">
                  <p>• AC buses: ₹200–₹350</p>
                  <p>• Non-AC Ordinary: ₹80–₹150</p>
                  <p>• Express services: ₹120–₹250</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
