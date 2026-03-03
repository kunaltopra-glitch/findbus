import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Bus, BusTiming, PaymentMethod, Route } from "../backend.d";
import { useActor } from "./useActor";

// ── Route Queries ──────────────────────────────────────
export function useGetAllRoutes() {
  const { actor, isFetching } = useActor();
  return useQuery<Route[]>({
    queryKey: ["routes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRoutes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Bus Queries ────────────────────────────────────────
export function useGetAllBuses() {
  const { actor, isFetching } = useActor();
  return useQuery<Bus[]>({
    queryKey: ["buses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBusDetails(busId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Bus>({
    queryKey: ["bus", busId],
    queryFn: async () => {
      if (!actor || !busId) throw new Error("No actor or busId");
      return actor.getBusDetails(busId);
    },
    enabled: !!actor && !isFetching && !!busId,
    refetchInterval: 5000,
  });
}

export function useGetBusesByRoute(routeId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Bus[]>({
    queryKey: ["buses", "route", routeId],
    queryFn: async () => {
      if (!actor || !routeId) return [];
      return actor.getBusesByRouteId(routeId);
    },
    enabled: !!actor && !isFetching && !!routeId,
  });
}

// ── Bus Timing Queries ─────────────────────────────────
export function useGetTimingsByRoute(routeId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BusTiming[]>({
    queryKey: ["timings", routeId],
    queryFn: async () => {
      if (!actor || !routeId) return [];
      return actor.getTimingsByRouteId(routeId);
    },
    enabled: !!actor && !isFetching && !!routeId,
  });
}

// ── Mutations ──────────────────────────────────────────
export function useBookTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      ticketId: string;
      passengerName: string;
      fromStop: string;
      toStop: string;
      busId: string;
      timingId: string;
      paymentMethod: PaymentMethod;
      amount: bigint;
    }) => {
      if (!actor) throw new Error("No actor available");
      await actor.bookTicket(
        params.id,
        params.ticketId,
        params.passengerName,
        params.fromStop,
        params.toStop,
        params.busId,
        params.timingId,
        params.paymentMethod,
        params.amount,
      );
      return params.ticketId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useUpdateBusPosition() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: { busId: string; currentStopIndex: bigint }) => {
      if (!actor) throw new Error("No actor available");
      await actor.updateBusPosition(params.busId, params.currentStopIndex);
    },
  });
}

export function useAddRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      fromStop: string;
      toStop: string;
      stops: string[];
    }) => {
      if (!actor) throw new Error("No actor available");
      await actor.addRoute(
        params.id,
        params.name,
        params.fromStop,
        params.toStop,
        params.stops,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useAddBus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      busNumber: string;
      driverID: string;
      conductorID: string;
      busType: string;
      routeId: string;
      status: import("../backend.d").BusStatus;
    }) => {
      if (!actor) throw new Error("No actor available");
      await actor.addBus(
        params.id,
        params.busNumber,
        params.driverID,
        params.conductorID,
        params.busType,
        params.routeId,
        params.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
}
