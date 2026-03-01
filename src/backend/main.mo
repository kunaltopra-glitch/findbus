import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

actor {
  type BusStatus = {
    #OnTime;
    #Delayed;
    #Cancelled;
  };

  type Route = {
    id : Text;
    name : Text;
    fromStop : Text;
    toStop : Text;
    stops : [Text];
  };

  type Bus = {
    id : Text;
    busNumber : Text;
    driverID : Text;
    conductorID : Text;
    busType : Text;
    routeId : Text;
    currentStopIndex : Nat;
    speed : Float;
    status : BusStatus;
  };

  type BusTiming = {
    id : Text;
    busId : Text;
    departureTime : Time.Time;
    arrivalTime : Time.Time;
    routeId : Text;
  };

  type PaymentMethod = {
    #Cash;
    #Online;
  };

  type Ticket = {
    id : Text;
    ticketId : Text;
    passengerName : Text;
    fromStop : Text;
    toStop : Text;
    busId : Text;
    timingId : Text;
    paymentMethod : PaymentMethod;
    amount : Nat;
    createdAt : Time.Time;
  };

  // Persistent data
  let routes = Map.empty<Text, Route>();
  let buses = Map.empty<Text, Bus>();
  let busTimings = Map.empty<Text, BusTiming>();
  let tickets = Map.empty<Text, Ticket>();

  public shared ({ caller }) func addRoute(id : Text, name : Text, fromStop : Text, toStop : Text, stops : [Text]) : async () {
    if (routes.containsKey(id)) { Runtime.trap("routeId " # id # " does already exist in the database") };

    let route : Route = {
      id;
      name;
      fromStop;
      toStop;
      stops;
    };
    routes.add(id, route);
  };

  public shared ({ caller }) func addBus(id : Text, busNumber : Text, driverID : Text, conductorID : Text, busType : Text, routeId : Text, status : BusStatus) : async () {
    if (buses.containsKey(id)) { Runtime.trap("busId " # id # " does already exist in the database") };
    if (not routes.containsKey(routeId)) { Runtime.trap("routeId " # routeId # " does not exist in the database") };

    let bus : Bus = {
      id;
      busNumber;
      driverID;
      conductorID;
      busType;
      routeId;
      currentStopIndex = 0;
      speed = 0.0;
      status;
    };
    buses.add(id, bus);
  };

  public shared ({ caller }) func addBusTiming(id : Text, busId : Text, departureTime : Time.Time, arrivalTime : Time.Time, routeId : Text) : async () {
    if (busTimings.containsKey(id)) { Runtime.trap("busTimingId " # id # " does already exist in the database") };
    if (not buses.containsKey(busId)) { Runtime.trap("busId " # busId # " does not exist in the database") };
    if (not routes.containsKey(routeId)) { Runtime.trap("routeId " # routeId # " does not exist in the database") };

    let timing : BusTiming = {
      id;
      busId;
      departureTime;
      arrivalTime;
      routeId;
    };
    busTimings.add(id, timing);
  };

  public shared ({ caller }) func bookTicket(id : Text, ticketId : Text, passengerName : Text, fromStop : Text, toStop : Text, busId : Text, timingId : Text, paymentMethod : PaymentMethod, amount : Nat) : async () {
    if (tickets.containsKey(id)) { Runtime.trap("ticketId " # id # " does already exist in the database") };
    if (not buses.containsKey(busId)) { Runtime.trap("busId " # busId # " does not exist in the database") };
    if (not busTimings.containsKey(timingId)) { Runtime.trap("timingId " # timingId # " does not exist in the database") };

    let ticket : Ticket = {
      id;
      ticketId;
      passengerName;
      fromStop;
      toStop;
      busId;
      timingId;
      paymentMethod;
      amount;
      createdAt = Time.now();
    };

    tickets.add(id, ticket);
  };

  public shared ({ caller }) func updateBusPosition(busId : Text, currentStopIndex : Nat) : async () {
    switch (buses.get(busId)) {
      case (null) { Runtime.trap("busId " # busId # " does not exist in the database") };
      case (?bus) {
        buses.add(
          busId,
          {
            id = bus.id;
            busNumber = bus.busNumber;
            driverID = bus.driverID;
            conductorID = bus.conductorID;
            busType = bus.busType;
            routeId = bus.routeId;
            currentStopIndex;
            speed = bus.speed;
            status = bus.status;
          },
        );
      };
    };
  };

  public query ({ caller }) func getAllRoutes() : async [Route] {
    routes.values().toArray();
  };

  public query ({ caller }) func getBusesByRouteId(routeId : Text) : async [Bus] {
    buses.values().filter(func(bus) { bus.routeId == routeId }).toArray();
  };

  public query ({ caller }) func getBusDetails(busId : Text) : async Bus {
    switch (buses.get(busId)) {
      case (null) { Runtime.trap("busId " # busId # " does not exist in the database") };
      case (?bus) { bus };
    };
  };

  public query ({ caller }) func getTimingsByRouteId(routeId : Text) : async [BusTiming] {
    busTimings.values().filter(func(timing) { timing.routeId == routeId }).toArray();
  };

  public query ({ caller }) func getAllBuses() : async [Bus] {
    buses.values().toArray();
  };

  public query ({ caller }) func getTicket(ticketId : Text) : async Ticket {
    switch (tickets.get(ticketId)) {
      case (null) { Runtime.trap("ticket " # ticketId # " does not exist in the database") };
      case (?ticket) { ticket };
    };
  };
};
