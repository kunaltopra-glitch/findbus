import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { StopPicker } from "@/components/StopPicker";
import { ArrowRight } from "lucide-react";
import type { Route, Bus } from "../backend.d";
import {
  DEMO_ROUTES,
  DEMO_BUSES,
  findRouteForStops,
  getAllStops,
} from "../utils/demoData";
import {
  useGetAllRoutes,
  useGetBusesByRoute,
  useUpdateBusPosition,
} from "../hooks/useQueries";

export default function ETIMPage() {
  const navigate = useNavigate();
  const { clear: logout } = useInternetIdentity();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // route selection state
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [routeId, setRouteId] = useState<string | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const { data: backendRoutes } = useGetAllRoutes();
  const routes: Route[] = backendRoutes?.length ? backendRoutes : DEMO_ROUTES;
  const allStops = getAllStops(routes);

  const toStops = fromStop
    ? routes
        .filter((r) => r.stops.includes(fromStop))
        .flatMap((r) => r.stops.slice(r.stops.indexOf(fromStop) + 1))
        .filter((v, i, a) => a.indexOf(v) === i)
    : allStops;

  const filteredFromStops = allStops.filter((stop) =>
    stop.toLowerCase().includes(fromSearch.toLowerCase()),
  );
  const filteredToStops = toStops.filter((stop) =>
    stop.toLowerCase().includes(toSearch.toLowerCase()),
  );

  useEffect(() => {
    if (fromStop && toStop) {
      const r = findRouteForStops(fromStop, toStop, routes);
      setRouteId(r ? r.id : null);
      setSelectedBusId(null);
    } else {
      setRouteId(null);
      setSelectedBusId(null);
    }
  }, [fromStop, toStop, routes]);

  const { data: backendBuses } = useGetBusesByRoute(routeId || "");
  const availableBuses: Bus[] =
    (backendBuses && backendBuses.length ? backendBuses : []) ||
    (routeId ? DEMO_BUSES.filter((b) => b.routeId === routeId) : []);

  const { mutate: updatePosition } = useUpdateBusPosition();

  const startTrip = () => {
    setError(null);
    if (!routeId || !selectedBusId) {
      setError("Please select a route and bus before starting the trip.");
      return;
    }
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updatePosition({ busId: selectedBusId, currentStopIndex: BigInt(0) });
        setLoading(false);
        navigate({ to: "/trip-started", search: { busId: selectedBusId! } });
      },
      (err) => {
        setError(err.message || "Unable to access location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSignout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-xl p-6 border border-border">
        <h2 className="font-display font-bold text-2xl mb-2 text-center">
          Ready to start the trip
        </h2>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Select route and bus, then press start to publish your location.
        </p>
        {error && <div className="text-sm text-destructive mb-2 text-center">{error}</div>}

        {/* Route selection */}
        <div className="space-y-4">
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

          {routeId && (
            <div className="space-y-2">
              <label className="text-sm font-body font-medium text-foreground">
                Select Bus
              </label>
              {availableBuses.length > 0 ? (
                <select
                  value={selectedBusId || ""}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm"
                >
                  <option value="" disabled>
                    Choose a bus
                  </option>
                  {availableBuses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-muted-foreground">No buses on this route</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-col mt-6">
          <Button
            onClick={startTrip}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Requesting location..." : "Start Trip"}
          </Button>
          <Button onClick={handleSignout} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
