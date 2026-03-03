import React, { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useUpdateBusPosition } from "../hooks/useQueries";
import { DEMO_BUSES, getBusById } from "../utils/demoData";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function TripStartedPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { busId?: string };
  const { clear: logout } = useInternetIdentity();
  const { mutate: updatePosition } = useUpdateBusPosition();

  const busId = search?.busId;
  const demoBus = busId ? getBusById(busId, DEMO_BUSES) : undefined;

  // periodically ping backend so passengers see location updates
  useEffect(() => {
    if (!busId) return;
    const iv = setInterval(() => {
      updatePosition({ busId, currentStopIndex: BigInt(0) });
    }, 15000);
    return () => clearInterval(iv);
  }, [busId, updatePosition]);

  const endTrip = async () => {
    // ending trip simply logs the user out and returns to login screen
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }

    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase sign out failed", e);
    }

    navigate({ to: "/login" });
  };

  const handleSignOut = endTrip;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-xl p-6 border border-border text-center">
        <h2 className="font-display font-bold text-2xl mb-2">The trip is started</h2>
        {busId && (
          <p className="text-sm font-medium mb-2">
            Bus: {demoBus?.busNumber ?? busId}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          Your current location has been accessed and the trip is recorded as started.
        </p>
        <div className="flex gap-2 flex-col">
          <Button onClick={endTrip} className="w-full">
            Stop Trip
          </Button>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
