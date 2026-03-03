import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";

export default function ETIMPage() {
  const navigate = useNavigate();
  const { clear: logout } = useInternetIdentity();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTrip = () => {
    setError(null);
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        navigate({ to: "/trip-started" });
      },
      (err) => {
        setError(err.message || "Unable to access location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSignout = async () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-xl p-6 border border-border text-center">
        <h2 className="font-display font-bold text-2xl mb-2">Ready to start the trip</h2>
        <p className="text-sm text-muted-foreground mb-4">Press the button below to start trip and share your location.</p>
        {error && <div className="text-sm text-destructive mb-2">{error}</div>}
        <div className="flex gap-2 flex-col">
          <Button onClick={startTrip} disabled={loading} className="w-full">{loading ? "Requesting location..." : "Start Trip"}</Button>
          <Button onClick={handleSignout} variant="outline" className="w-full">Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
