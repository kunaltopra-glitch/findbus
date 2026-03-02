import type { Bus, BusStatus, BusTiming, Route } from "../backend.d";

// ── Demo Routes ────────────────────────────────────────
export const DEMO_ROUTES: Route[] = [
  {
    id: "route-1",
    name: "Rohtak → Hisar",
    fromStop: "Rohtak",
    toStop: "Hisar",
    stops: ["Rohtak", "Jhajjar", "Bhiwani", "Hisar"],
  },
  {
    id: "route-2",
    name: "Gurugram → Chandigarh",
    fromStop: "Gurugram",
    toStop: "Chandigarh",
    stops: ["Gurugram", "Manesar", "Rewari", "Ambala", "Chandigarh"],
  },
  {
    id: "route-3",
    name: "Panipat → Delhi",
    fromStop: "Panipat",
    toStop: "Delhi",
    stops: ["Panipat", "Sonipat", "Bahadurgarh", "Delhi"],
  },
  {
    id: "route-4",
    name: "Yamunanagar → Saraswati Nagar",
    fromStop: "Yamunanagar",
    toStop: "Saraswati Nagar",
    stops: ["Yamunanagar", "Vishwakarma Chowk", "Jorion", "Mandebar", "Gohlanpur", "Harnaul", "Chhota Topra", "Badanpuri", "Ismailpur", "Topra Kalan", "Sagri", "Kheri Lakha Singh", "Masana", "Satgoli", "Rapoli", "Kajibans", "Saraswati Nagar"],
  },
  {
    id: "route-5",
    name: "Yamunanagar → Saraswati Nagar",
    fromStop: "Yamunanagar",
    toStop: "Saraswati Nagar",
    stops: ["Yamunanagar", "Vishwakarma Chowk", "Jorion", "Mandebar", "Gohlanpur", "Harnaul", "Chhota Topra", "Badanpuri", "Ismailpur", "Topra Kalan", "Sagri", "Kheri Lakha Singh", "Antawa", "Hartan", "Bhogpur", "Ghari", "Saraswati Nagar"],
  },
  {
    id: "route-6",
    name: "Yamunanagar → Barara",
    fromStop: "Yamunanagar",
    toStop: "Barara",
    stops: ["Yamunanagar", "Vishwakarma Chowk", "Jorion", "Mandebar", "Gohlanpur", "Harnaul", "Chhota Topra", "Badanpuri", "Ismailpur", "Topra Kalan", "Sagri", "Kheri Lakha Singh", "Antawa", "Hartan", "Bhogpur", "Jamalpur","Adhoya", "Barara"],
  },
  {
    id: "route-7",
    name: "Yamunanagar → Saraswati Nagar",
    fromStop: "Yamunanagar",
    toStop: "Saraswati Nagar",
    stops: ["Yamunanagar", "Vishwakarma Chowk", "Jorion", "Mandebar", "Gohlanpur", "Harnaul", "Retgarh", "Hafizpur", "Ismailpur", "Jhaguri","Nagla", "Sagri", "Kheri Lakha Singh", "Masana", "Satgoli", "Rapoli", "Kajibans", "Saraswati Nagar"],
  }, 
  {
    id: "route-8",
    name: "Saraswati Nagar → Yamunanagar",
    fromStop: "Saraswati Nagar",
    toStop: "Yamunanagar",
    stops: ["Saraswati Nagar", "Kajibans", "Rapoli", "Satgoli", "Masana", "Kheri Lakha Singh", "Sagri", "Topra Kalan", "Ismailpur", "Badanpuri", "Chhota Topra", "Harnaul", "Gohlanpur", "Mandebar", "Jorion", "Vishwakarma Chowk", "Yamunanagar"],
  }, 
{
    id: "route-9",
    name: "Saraswati Nagar → Yamunanagar",
    fromStop: "Saraswati Nagar",
    toStop: "Yamunanagar",
    stops: ["Saraswati Nagar", "Ghari", "Bhogpur", "Hartan", "Antawa", "Kheri Lakha Singh", "Sagri", "Topra Kalan", "Ismailpur", "Badanpuri", "Chhota Topra", "Harnaul", "Gohlanpur", "Mandebar", "Jorion", "Vishwakarma Chowk", "Yamunanagar"],
  },
  {
    id: "route-10",
    name: "Barara → Yamunanagar",
    fromStop: "Barara",
    toStop: "Yamunanagar",
    stops: ["Barara", "Adhoya", "Jamalpur", "Bhogpur", "Hartan", "Antawa", "Kheri Lakha Singh", "Sagri", "Topra Kalan", "Ismailpur", "Badanpuri", "Chhota Topra", "Harnaul", "Gohlanpur", "Mandebar", "Jorion", "Vishwakarma Chowk", "Yamunanagar"],
  },
  {
    id: "route-11",
    name: "Saraswati Nagar → Yamunanagar",
    fromStop: "Saraswati Nagar",
    toStop: "Yamunanagar",
    stops: ["Saraswati Nagar", "Kajibans", "Rapoli", "Satgoli", "Masana", "Kheri Lakha Singh", "Sagri", "Nagla", "Jhaguri", "Ismailpur", "Hafizpur", "Retgarh", "Harnaul", "Gohlanpur", "Mandebar", "Jorion", "Vishwakarma Chowk", "Yamunanagar"],
  }, 
];

// ── Helper to generate nanosecond timestamps ───────────
function timeFromHHMM(hh: number, mm: number): bigint {
  const now = new Date();
  now.setHours(hh, mm, 0, 0);
  return BigInt(now.getTime()) * BigInt(1_000_000);
}

// ── Demo Bus Timings ───────────────────────────────────
export const DEMO_TIMINGS: BusTiming[] = [
  // Route 1 - Rohtak → Hisar
  {
    id: "timing-1a",
    busId: "bus-1",
    routeId: "route-1",
    departureTime: timeFromHHMM(6, 0),
    arrivalTime: timeFromHHMM(9, 30),
  },
  {
    id: "timing-1b",
    busId: "bus-2",
    routeId: "route-1",
    departureTime: timeFromHHMM(10, 30),
    arrivalTime: timeFromHHMM(14, 0),
  },
  {
    id: "timing-1c",
    busId: "bus-3",
    routeId: "route-1",
    departureTime: timeFromHHMM(15, 0),
    arrivalTime: timeFromHHMM(18, 30),
  },
  // Route 2 - Gurugram → Chandigarh
  {
    id: "timing-2a",
    busId: "bus-4",
    routeId: "route-2",
    departureTime: timeFromHHMM(7, 0),
    arrivalTime: timeFromHHMM(11, 30),
  },
  {
    id: "timing-2b",
    busId: "bus-5",
    routeId: "route-2",
    departureTime: timeFromHHMM(12, 0),
    arrivalTime: timeFromHHMM(16, 30),
  },
  {
    id: "timing-2c",
    busId: "bus-6",
    routeId: "route-2",
    departureTime: timeFromHHMM(17, 0),
    arrivalTime: timeFromHHMM(21, 30),
  },
  // Route 3 - Panipat → Delhi
  {
    id: "timing-3a",
    busId: "bus-7",
    routeId: "route-3",
    departureTime: timeFromHHMM(5, 30),
    arrivalTime: timeFromHHMM(8, 0),
  },
  {
    id: "timing-3b",
    busId: "bus-8",
    routeId: "route-3",
    departureTime: timeFromHHMM(11, 0),
    arrivalTime: timeFromHHMM(13, 30),
  },
  {
    id: "timing-3c",
    busId: "bus-9",
    routeId: "route-3",
    departureTime: timeFromHHMM(16, 30),
    arrivalTime: timeFromHHMM(19, 0),
  },
  {
    id: "timing-4a",
    busId: "bus-10",
    routeId: "route-4",
    departureTime: timeFromHHMM(12, 0),
    arrivalTime: timeFromHHMM(13, 0),
  },
  {
    id: "timing-4b",
    busId: "bus-10",
    routeId: "route-4",
    departureTime: timeFromHHMM(14, 30),
    arrivalTime: timeFromHHMM(15, 30),
  },
  {
    id: "timing-5a",
    busId: "bus-11",
    routeId: "route-5",
    departureTime: timeFromHHMM(16, 30),
    arrivalTime: timeFromHHMM(18, 0),
  },
  {
    id: "timing-6a",
    busId: "bus-12",
    routeId: "route-6",
    departureTime: timeFromHHMM(17, 0 ),
    arrivalTime: timeFromHHMM(18, 30),
  },
  {
    id: "timing-7a",
    busId: "bus-13",
    routeId: "route-7",
    departureTime: timeFromHHMM(17, 20),
    arrivalTime: timeFromHHMM(18, 30),
  },
  {
    id: "timing-8a",
    busId: "bus-14",
    routeId: "route-8",
    departureTime: timeFromHHMM(13, 0),
    arrivalTime: timeFromHHMM(14, 0),
  },
  {
    id: "timing-8b",
    busId: "bus-15",
    routeId: "route-8",
    departureTime: timeFromHHMM(15, 30),
    arrivalTime: timeFromHHMM(16, 30),
  },
  {
    id: "timing-9a",
    busId: "bus-16",
    routeId: "route-9",
    departureTime: timeFromHHMM(7, 0),
    arrivalTime: timeFromHHMM(8, 0),
  },
  {
    id: "timing-10a",
    busId: "bus-17",
    routeId: "route-10",
    departureTime: timeFromHHMM(7, 0),
    arrivalTime: timeFromHHMM(8, 0),
  },
  {
    id: "timing-11a",
    busId: "bus-18",
    routeId: "route-11",
    departureTime: timeFromHHMM(7, 0),
    arrivalTime: timeFromHHMM(8, 30),
  },
];

// ── Demo Buses ─────────────────────────────────────────
export const DEMO_BUSES: Bus[] = [
  {
    id: "bus-1",
    busNumber: "HR-10-PA-0231",
    driverID: "DRV-2041",
    conductorID: "CND-3082",
    busType: "Non-AC Volvo",
    routeId: "route-1",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-2",
    busNumber: "HR-55-AB-1190",
    driverID: "DRV-2058",
    conductorID: "CND-3095",
    busType: "AC Express",
    routeId: "route-1",
    status: "Delayed" as BusStatus,
    speed: 45,
    currentStopIndex: BigInt(0),
  },
  {
    id: "bus-3",
    busNumber: "HR-29-C-4455",
    driverID: "DRV-2063",
    conductorID: "CND-3110",
    busType: "Non-AC Ordinary",
    routeId: "route-1",
    status: "OnTime" as BusStatus,
    speed: 55,
    currentStopIndex: BigInt(2),
  },
  {
    id: "bus-4",
    busNumber: "HR-26-AB-5567",
    driverID: "DRV-2071",
    conductorID: "CND-3121",
    busType: "AC Volvo",
    routeId: "route-2",
    status: "OnTime" as BusStatus,
    speed: 70,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-5",
    busNumber: "HR-12-CA-3301",
    driverID: "DRV-2085",
    conductorID: "CND-3137",
    busType: "Non-AC Express",
    routeId: "route-2",
    status: "OnTime" as BusStatus,
    speed: 60,
    currentStopIndex: BigInt(2),
  },
  {
    id: "bus-6",
    busNumber: "HR-09-XB-7823",
    driverID: "DRV-2092",
    conductorID: "CND-3148",
    busType: "AC Express",
    routeId: "route-2",
    status: "Delayed" as BusStatus,
    speed: 38,
    currentStopIndex: BigInt(0),
  },
  {
    id: "bus-7",
    busNumber: "HR-07-PA-9910",
    driverID: "DRV-2103",
    conductorID: "CND-3162",
    busType: "Non-AC Ordinary",
    routeId: "route-3",
    status: "OnTime" as BusStatus,
    speed: 65,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-8",
    busNumber: "HR-44-BB-2234",
    driverID: "DRV-2118",
    conductorID: "CND-3175",
    busType: "AC Volvo",
    routeId: "route-3",
    status: "OnTime" as BusStatus,
    speed: 75,
    currentStopIndex: BigInt(0),
  },
  {
    id: "bus-9",
    busNumber: "HR-19-CC-6678",
    driverID: "DRV-2126",
    conductorID: "CND-3189",
    busType: "Non-AC Express",
    routeId: "route-3",
    status: "Cancelled" as BusStatus,
    speed: 0,
    currentStopIndex: BigInt(0),
  },
  {
    id: "bus-10",
    busNumber: "HR-10-PA-0231",
    driverID: "DRV-2041",
    conductorID: "CND-3082",
    busType: "Non-AC Volvo",
    routeId: "route-4",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-11",
    busNumber: "HR-10-PA-0232",
    driverID: "DRV-2042",
    conductorID: "CND-3083",
    busType: "Non-AC Volvo",
    routeId: "route-5",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-12",
    busNumber: "HR-10-PA-0233",
    driverID: "DRV-2043",
    conductorID: "CND-3084",
    busType: "Non-AC Volvo",
    routeId: "route-6",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-13",
    busNumber: "HR-10-PA-0234",
    driverID: "DRV-2044",
    conductorID: "CND-3085",
    busType: "Non-AC Volvo",
    routeId: "route-7",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-14",
    busNumber: "HR-10-PA-0235",
    driverID: "DRV-2045",
    conductorID: "CND-3086",
    busType: "Non-AC Volvo",
    routeId: "route-8",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-14",
    busNumber: "HR-10-PA-0235",
    driverID: "DRV-2045",
    conductorID: "CND-3086",
    busType: "Non-AC Volvo",
    routeId: "route-8",
    status: "Delayed" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-15", 
    busNumber: "HR-10-PA-0236",
    driverID: "DRV-2046",
    conductorID: "CND-3087",
    busType: "Non-AC Volvo",
    routeId: "route-9",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-16", 
    busNumber: "HR-10-PA-0237",
    driverID: "DRV-2047",
    conductorID: "CND-3088",
    busType: "Non-AC Volvo",
    routeId: "route-10",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-17",
    busNumber: "HR-10-PA-0238",
    driverID: "DRV-2048",
    conductorID: "CND-3089",
    busType: "Non-AC Volvo",
    routeId: "route-11",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
  },
  {
    id: "bus-18",
    busNumber: "HR-10-PA-0239",
    driverID: "DRV-2049",
    conductorID: "CND-3090",
    busType: "Non-AC Volvo",
    routeId: "route-11",
    status: "OnTime" as BusStatus,
    speed: 62,
    currentStopIndex: BigInt(1),
   },
];

// ── Helper functions ───────────────────────────────────
export function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getRouteById(id: string, routes: Route[]): Route | undefined {
  return routes.find((r) => r.id === id);
}

export function getBusById(id: string, buses: Bus[]): Bus | undefined {
  return buses.find((b) => b.id === id);
}

export function findRouteForStops(
  fromStop: string,
  toStop: string,
  routes: Route[],
): Route | undefined {
  return routes.find((r) => {
    const fromIdx = r.stops.indexOf(fromStop);
    const toIdx = r.stops.indexOf(toStop);
    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
  });
}

export function getAllStops(routes: Route[]): string[] {
  const stops = new Set<string>();
  for (const r of routes) {
    for (const s of r.stops) {
      stops.add(s);
    }
  }
  return Array.from(stops).sort();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "OnTime":
      return "status-ontime";
    case "Delayed":
      return "status-delayed";
    case "Cancelled":
      return "status-cancelled";
    default:
      return "status-ontime";
  }
}
