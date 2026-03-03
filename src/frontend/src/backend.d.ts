import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Bus {
    id: string;
    status: BusStatus;
    driverID: string;
    busType: string;
    busNumber: string;
    speed: number;
    routeId: string;
    currentStopIndex: bigint;
    conductorID: string;
}
export interface Ticket {
    id: string;
    paymentMethod: PaymentMethod;
    createdAt: Time;
    timingId: string;
    ticketId: string;
    passengerName: string;
    toStop: string;
    fromStop: string;
    busId: string;
    amount: bigint;
}
export interface BusTiming {
    id: string;
    arrivalTime: Time;
    departureTime: Time;
    routeId: string;
    busId: string;
}
export interface Route {
    id: string;
    name: string;
    toStop: string;
    stops: Array<string>;
    fromStop: string;
}
export enum BusStatus {
    OnTime = "OnTime",
    Cancelled = "Cancelled",
    Delayed = "Delayed"
}
export enum PaymentMethod {
    Cash = "Cash",
    Online = "Online"
}
export interface backendInterface {
    addBus(id: string, busNumber: string, driverID: string, conductorID: string, busType: string, routeId: string, status: BusStatus): Promise<void>;
    addBusTiming(id: string, busId: string, departureTime: Time, arrivalTime: Time, routeId: string): Promise<void>;
    addRoute(id: string, name: string, fromStop: string, toStop: string, stops: Array<string>): Promise<void>;
    bookTicket(id: string, ticketId: string, passengerName: string, fromStop: string, toStop: string, busId: string, timingId: string, paymentMethod: PaymentMethod, amount: bigint): Promise<void>;
    getAllBuses(): Promise<Array<Bus>>;
    getAllRoutes(): Promise<Array<Route>>;
    getBusDetails(busId: string): Promise<Bus>;
    getBusesByRouteId(routeId: string): Promise<Array<Bus>>;
    getTicket(ticketId: string): Promise<Ticket>;
    getTimingsByRouteId(routeId: string): Promise<Array<BusTiming>>;
    updateBusPosition(busId: string, currentStopIndex: bigint): Promise<void>;
}
