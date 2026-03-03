import React from "react";

export default function TripStartedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-xl p-6 border border-border text-center">
        <h2 className="font-display font-bold text-2xl mb-2">The trip is started</h2>
        <p className="text-sm text-muted-foreground">Your current location has been accessed and the trip is recorded as started.</p>
      </div>
    </div>
  );
}
