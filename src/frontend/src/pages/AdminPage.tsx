import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bus, Loader2, MapPin, Plus, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BusStatus } from "../backend.d";
import { useAddBus, useAddRoute, useGetAllBuses } from "../hooks/useQueries";
import { DEMO_BUSES } from "../utils/demoData";

function generateId(): string {
  return crypto.randomUUID();
}

export function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[oklch(0.14_0.08_264)] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-[oklch(0.72_0.21_50)]" />
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-2xl text-white">
                  Admin Panel
                </h1>
                <Badge className="text-xs font-body bg-[oklch(0.72_0.21_50/0.2)] text-[oklch(0.82_0.18_55)] border-[oklch(0.72_0.21_50/0.4)]">
                  RESTRICTED
                </Badge>
              </div>
            </div>
            <p className="text-[oklch(0.6_0.04_250)] font-body text-sm">
              Administrative controls for FindBus – Haryana Roadways
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Tabs defaultValue="buses">
          <TabsList className="mb-6 font-body">
            <TabsTrigger value="buses" className="font-body">
              <Bus className="w-4 h-4 mr-1.5" />
              Manage Buses
            </TabsTrigger>
            <TabsTrigger value="routes" className="font-body">
              <MapPin className="w-4 h-4 mr-1.5" />
              Manage Routes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buses" className="space-y-6">
            <AddBusForm />
            <BusList />
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <AddRouteForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AddBusForm() {
  const [busNumber, setBusNumber] = useState("");
  const [driverID, setDriverID] = useState("");
  const [conductorID, setConductorID] = useState("");
  const [busType, setBusType] = useState("");
  const [routeId, setRouteId] = useState("");
  const [status, setStatus] = useState<BusStatus>(BusStatus.OnTime);

  const { mutateAsync: addBus, isPending } = useAddBus();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!busNumber || !driverID || !conductorID || !busType || !routeId) {
      toast.error("Please fill all fields.");
      return;
    }
    try {
      await addBus({
        id: generateId(),
        busNumber,
        driverID,
        conductorID,
        busType,
        routeId,
        status,
      });
      toast.success(`Bus ${busNumber} added successfully!`);
      setBusNumber("");
      setDriverID("");
      setConductorID("");
      setBusType("");
      setRouteId("");
    } catch {
      toast.error("Failed to add bus. Please try again.");
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-[oklch(0.72_0.21_50)]" />
          Add New Bus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Bus Number</Label>
            <Input
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              placeholder="e.g. HR-10-PA-0231"
              className="font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Route ID</Label>
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger className="font-body">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="route-1" className="font-body">
                  route-1 (Rohtak → Hisar)
                </SelectItem>
                <SelectItem value="route-2" className="font-body">
                  route-2 (Gurugram → Chandigarh)
                </SelectItem>
                <SelectItem value="route-3" className="font-body">
                  route-3 (Panipat → Delhi)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Driver ID</Label>
            <Input
              value={driverID}
              onChange={(e) => setDriverID(e.target.value)}
              placeholder="e.g. DRV-2041"
              className="font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Conductor ID</Label>
            <Input
              value={conductorID}
              onChange={(e) => setConductorID(e.target.value)}
              placeholder="e.g. CND-3082"
              className="font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Bus Type</Label>
            <Select value={busType} onValueChange={setBusType}>
              <SelectTrigger className="font-body">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC Volvo" className="font-body">
                  AC Volvo
                </SelectItem>
                <SelectItem value="AC Express" className="font-body">
                  AC Express
                </SelectItem>
                <SelectItem value="Non-AC Express" className="font-body">
                  Non-AC Express
                </SelectItem>
                <SelectItem value="Non-AC Ordinary" className="font-body">
                  Non-AC Ordinary
                </SelectItem>
                <SelectItem value="Non-AC Volvo" className="font-body">
                  Non-AC Volvo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as BusStatus)}
            >
              <SelectTrigger className="font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BusStatus.OnTime} className="font-body">
                  On Time
                </SelectItem>
                <SelectItem value={BusStatus.Delayed} className="font-body">
                  Delayed
                </SelectItem>
                <SelectItem value={BusStatus.Cancelled} className="font-body">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="gradient-orange text-white font-body font-semibold border-0 hover:opacity-90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bus
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AddRouteForm() {
  const [name, setName] = useState("");
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [stopsInput, setStopsInput] = useState("");

  const { mutateAsync: addRoute, isPending } = useAddRoute();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !fromStop || !toStop || !stopsInput) {
      toast.error("Please fill all fields.");
      return;
    }
    const stops = stopsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (stops.length < 2) {
      toast.error("Please enter at least 2 stops (comma-separated).");
      return;
    }
    try {
      await addRoute({
        id: generateId(),
        name,
        fromStop: stops[0],
        toStop: stops[stops.length - 1],
        stops,
      });
      toast.success(`Route "${name}" added successfully!`);
      setName("");
      setFromStop("");
      setToStop("");
      setStopsInput("");
    } catch {
      toast.error("Failed to add route. Please try again.");
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-[oklch(0.72_0.21_50)]" />
          Add New Route
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Route Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ambala → Karnal"
              className="font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">From Stop</Label>
            <Input
              value={fromStop}
              onChange={(e) => setFromStop(e.target.value)}
              placeholder="Starting stop"
              className="font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">To Stop</Label>
            <Input
              value={toStop}
              onChange={(e) => setToStop(e.target.value)}
              placeholder="Ending stop"
              className="font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm">
              All Stops (comma-separated)
            </Label>
            <Input
              value={stopsInput}
              onChange={(e) => setStopsInput(e.target.value)}
              placeholder="Ambala, Kurukshetra, Karnal"
              className="font-body"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="gradient-orange text-white font-body font-semibold border-0 hover:opacity-90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Route
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function BusList() {
  const { data: backendBuses, isLoading } = useGetAllBuses();
  const buses = backendBuses?.length ? backendBuses : DEMO_BUSES;

  const statusBadge: Record<string, string> = {
    OnTime: "status-ontime",
    Delayed: "status-delayed",
    Cancelled: "status-cancelled",
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Bus className="w-4 h-4 text-[oklch(0.38_0.12_264)]" />
          All Buses ({isLoading ? "..." : buses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body text-xs">Bus Number</TableHead>
                <TableHead className="font-body text-xs">Type</TableHead>
                <TableHead className="font-body text-xs">Route</TableHead>
                <TableHead className="font-body text-xs">Driver</TableHead>
                <TableHead className="font-body text-xs">Status</TableHead>
                <TableHead className="font-body text-xs">Speed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell className="font-body font-semibold text-sm">
                    {bus.busNumber}
                  </TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground">
                    {bus.busType}
                  </TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground">
                    {bus.routeId}
                  </TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground">
                    {bus.driverID}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${statusBadge[String(bus.status)] ?? statusBadge.OnTime}`}
                    >
                      {String(bus.status)}
                    </span>
                  </TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground">
                    {bus.speed} km/h
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
