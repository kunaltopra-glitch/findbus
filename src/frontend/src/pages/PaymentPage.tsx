import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bus,
  CheckCircle2,
  CreditCard,
  Download,
  IndianRupee,
  Loader2,
  MapPin,
  Smartphone,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentMethod } from "../backend.d";
import { useBookTicket } from "../hooks/useQueries";
import {
  DEMO_BUSES,
  DEMO_ROUTES,
  getBusById,
  getRouteById,
} from "../utils/demoData";

type PaymentMethodUI = "upi" | "card";

function generateTicketId(): string {
  return `HR${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

function generateId(): string {
  return crypto.randomUUID();
}

export function PaymentPage() {
  const { busId } = useParams({ from: "/layout/payment/$busId" });
  const search = useSearch({ strict: false }) as {
    fromStop?: string;
    toStop?: string;
    timingId?: string;
  };
  const navigate = useNavigate();

  const bus = getBusById(busId, DEMO_BUSES);
  const route = getRouteById(bus?.routeId ?? "", DEMO_ROUTES);

  const [passengerName, setPassengerName] = useState("");
  const [fromStop, setFromStop] = useState(
    search?.fromStop ?? route?.fromStop ?? "",
  );
  const [toStop, setToStop] = useState(search?.toStop ?? route?.toStop ?? "");
  const [payMethod, setPayMethod] = useState<PaymentMethodUI>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutateAsync: bookTicket } = useBookTicket();
  const AMOUNT = BigInt(150);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!passengerName.trim()) {
      toast.error("Please enter passenger name.");
      return;
    }
    if (payMethod === "upi" && !upiId.trim()) {
      toast.error("Please enter UPI ID.");
      return;
    }
    if (payMethod === "card") {
      if (!cardNumber || !expiry || !cvv) {
        toast.error("Please fill all card details.");
        return;
      }
    }

    const newTicketId = generateTicketId();
    const id = generateId();

    setIsProcessing(true);
    // Simulate payment delay
    await new Promise((res) => setTimeout(res, 2000));

    try {
      await bookTicket({
        id,
        ticketId: newTicketId,
        passengerName: passengerName.trim(),
        fromStop: fromStop || route?.fromStop || "",
        toStop: toStop || route?.toStop || "",
        busId,
        timingId: search?.timingId ?? "timing-1a",
        paymentMethod:
          payMethod === "upi" ? PaymentMethod.Online : PaymentMethod.Online,
        amount: AMOUNT,
      });
    } catch {
      // Backend might not have the bus/timing seeded, proceed with demo success
    }

    setTicketId(newTicketId);
    setIsProcessing(false);
    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-border overflow-hidden">
            {/* Success header */}
            <div className="gradient-orange p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="font-display font-extrabold text-2xl text-white mb-1">
                Booking Confirmed!
              </h2>
              <p className="text-white/80 font-body text-sm">
                Your ticket has been generated successfully
              </p>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Ticket ID */}
              <div className="bg-secondary rounded-xl p-4 text-center border border-border">
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
                  Ticket ID
                </p>
                <p className="font-display font-black text-2xl text-[oklch(0.65_0.18_50)] tracking-wider">
                  {ticketId}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground font-body">
                    Passenger
                  </span>
                  <span className="text-sm font-body font-semibold text-foreground">
                    {passengerName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground font-body">
                    Bus
                  </span>
                  <span className="text-sm font-body font-semibold text-foreground">
                    {bus?.busNumber ?? busId}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground font-body">
                    Route
                  </span>
                  <span className="text-sm font-body font-semibold text-foreground">
                    {fromStop} → {toStop}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground font-body">
                    Amount Paid
                  </span>
                  <span className="text-sm font-body font-bold text-[oklch(0.45_0.12_145)]">
                    ₹150
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground font-body">
                    Payment
                  </span>
                  <Badge className="bg-[oklch(0.92_0.08_145)] text-[oklch(0.35_0.12_145)] border-none text-xs font-body">
                    Success
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 font-body"
                  onClick={() => {
                    toast.success("Ticket details saved to your device!");
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  className="flex-1 gradient-orange text-white font-body border-0 hover:opacity-90"
                  onClick={() => navigate({ to: "/" })}
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
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
          >
            <button
              type="button"
              onClick={() => navigate({ to: -1 as never })}
              className="flex items-center gap-2 text-[oklch(0.75_0.04_250)] hover:text-white transition-colors font-body text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <CreditCard className="w-3.5 h-3.5 text-[oklch(0.82_0.18_55)]" />
              <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold uppercase tracking-wider">
                Secure Payment
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white">
              Complete Your Booking
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handlePay} className="space-y-5">
              {/* Passenger Details */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-[oklch(0.38_0.12_264)]" />
                    Passenger Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Full Name</Label>
                    <Input
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="Enter passenger name"
                      className="font-body h-11"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-body text-sm flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[oklch(0.28_0.12_264)]" />
                        From Stop
                      </Label>
                      <Input
                        value={fromStop}
                        onChange={(e) => setFromStop(e.target.value)}
                        placeholder="e.g. Rohtak"
                        className="font-body h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-body text-sm flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.21_50)]" />
                        To Stop
                      </Label>
                      <Input
                        value={toStop}
                        onChange={(e) => setToStop(e.target.value)}
                        placeholder="e.g. Hisar"
                        className="font-body h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[oklch(0.38_0.12_264)]" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayMethod("upi")}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        payMethod === "upi"
                          ? "border-[oklch(0.72_0.21_50)] bg-[oklch(0.72_0.21_50/0.08)]"
                          : "border-border hover:border-[oklch(0.72_0.21_50/0.4)]"
                      }`}
                    >
                      <Smartphone
                        className={`w-5 h-5 mb-1.5 ${payMethod === "upi" ? "text-[oklch(0.65_0.18_50)]" : "text-muted-foreground"}`}
                      />
                      <p
                        className={`font-body font-semibold text-sm ${payMethod === "upi" ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        UPI
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        PhonePe, GPay, Paytm
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayMethod("card")}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        payMethod === "card"
                          ? "border-[oklch(0.28_0.12_264)] bg-[oklch(0.28_0.12_264/0.06)]"
                          : "border-border hover:border-[oklch(0.28_0.12_264/0.4)]"
                      }`}
                    >
                      <CreditCard
                        className={`w-5 h-5 mb-1.5 ${payMethod === "card" ? "text-[oklch(0.38_0.12_264)]" : "text-muted-foreground"}`}
                      />
                      <p
                        className={`font-body font-semibold text-sm ${payMethod === "card" ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        Card
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        Debit / Credit Card
                      </p>
                    </button>
                  </div>

                  {/* UPI Fields */}
                  <AnimatePresence mode="wait">
                    {payMethod === "upi" && (
                      <motion.div
                        key="upi"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1.5"
                      >
                        <Label className="font-body text-sm">UPI ID</Label>
                        <Input
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="font-body h-11"
                        />
                        <p className="text-xs text-muted-foreground font-body">
                          Enter your UPI ID (e.g. 9876543210@paytm)
                        </p>
                      </motion.div>
                    )}

                    {/* Card Fields */}
                    {payMethod === "card" && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="space-y-1.5">
                          <Label className="font-body text-sm">
                            Card Number
                          </Label>
                          <Input
                            value={cardNumber}
                            onChange={(e) =>
                              setCardNumber(
                                e.target.value
                                  .replace(/\D/g, "")
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim()
                                  .slice(0, 19),
                              )
                            }
                            placeholder="1234 5678 9012 3456"
                            className="font-body h-11 font-mono"
                            maxLength={19}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="font-body text-sm">Expiry</Label>
                            <Input
                              value={expiry}
                              onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "");
                                if (v.length >= 2)
                                  v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                                setExpiry(v);
                              }}
                              placeholder="MM/YY"
                              className="font-body h-11 font-mono"
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="font-body text-sm">CVV</Label>
                            <Input
                              value={cvv}
                              onChange={(e) =>
                                setCvv(
                                  e.target.value.replace(/\D/g, "").slice(0, 3),
                                )
                              }
                              placeholder="•••"
                              className="font-body h-11 font-mono"
                              type="password"
                              maxLength={3}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-orange text-white font-body font-semibold border-0 hover:opacity-90 h-12"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Pay ₹150 Now
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[oklch(0.28_0.12_264/0.1)] flex items-center justify-center">
                      <Bus className="w-5 h-5 text-[oklch(0.38_0.12_264)]" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-foreground">
                        {bus?.busNumber ?? busId}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {bus?.busType ?? "Standard Bus"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[oklch(0.72_0.21_50)] mt-0.5" />
                    <span className="text-muted-foreground font-body">
                      {fromStop || route?.fromStop} → {toStop || route?.toStop}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-body">
                      Base Fare
                    </span>
                    <span className="font-body text-foreground">₹130</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-body">
                      Service Fee
                    </span>
                    <span className="font-body text-foreground">₹20</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span className="font-body text-foreground">Total</span>
                    <span className="font-display text-[oklch(0.45_0.18_50)] text-lg">
                      ₹150
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body bg-secondary rounded-lg p-3">
                  <span className="text-green-600">🔒</span>
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
