import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  Shield,
  Signal,
  Ticket,
  Wifi,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const STATS = [
  { label: "Sample routes", value: "03", icon: MapPin },
  { label: "Scheduled departures", value: "09", icon: Navigation },
  { label: "Journey tools", value: "All in one", icon: Signal },
  { label: "Booking flow", value: "Simple", icon: Zap },
];

const FEATURES = [
  {
    icon: Signal,
    title: "Bus details at a glance",
    description:
      "Review sample service status, departure times, and route details together.",
    color: "text-[oklch(0.72_0.21_50)]",
    bg: "bg-[oklch(0.72_0.21_50/0.1)]",
  },
  {
    icon: Bot,
    title: "Helpful travel assistant",
    description:
      "Get quick answers about sample routes and how to use the booking experience.",
    color: "text-[oklch(0.55_0.12_264)]",
    bg: "bg-[oklch(0.28_0.12_264/0.1)]",
  },
  {
    icon: Ticket,
    title: "A clear booking flow",
    description:
      "Follow a simple ticket-booking demo from route selection through confirmation.",
    color: "text-[oklch(0.58_0.12_145)]",
    bg: "bg-[oklch(0.6_0.12_145/0.1)]",
  },
  {
    icon: Wifi,
    title: "Route details in one view",
    description:
      "Compare the stops and scheduled departures available in the sample network.",
    color: "text-[oklch(0.62_0.14_285)]",
    bg: "bg-[oklch(0.62_0.14_285/0.1)]",
  },
  {
    icon: Shield,
    title: "Clear service information",
    description:
      "See route and bus information together, with sample data clearly presented.",
    color: "text-[oklch(0.72_0.21_50)]",
    bg: "bg-[oklch(0.72_0.21_50/0.1)]",
  },
  {
    icon: Clock,
    title: "Useful journey details",
    description:
      "Check the details you need to plan a trip without jumping between pages.",
    color: "text-[oklch(0.55_0.12_264)]",
    bg: "bg-[oklch(0.28_0.12_264/0.1)]",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Select Your Route",
    description:
      "Choose a boarding stop and destination from the routes in our sample network.",
  },
  {
    step: "02",
    title: "Review Bus Details",
    description:
      "Review sample bus details and service status alongside your selected route.",
  },
  {
    step: "03",
    title: "Check scheduled times",
    description:
      "Compare sample departure and arrival times; schedules are not live ETA predictions.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero Section ──────────────────────────────── */}
      <section className="relative gradient-hero min-h-[90vh] flex items-center overflow-hidden roadway-pattern">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-[oklch(0.72_0.21_50/0.08)] blur-3xl" />
          <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-[oklch(0.45_0.15_250/0.1)] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.21_50/0.18)] border border-[oklch(0.72_0.21_50/0.3)] rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.21_50)] pulse-dot" />
                <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold tracking-wider uppercase">
                  Plan your next journey
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
                <span className="text-[oklch(0.65_0.12_230)]">
                  Plan your next
                </span>
                <br />
                <span className="text-gradient-orange">bus journey</span>
                <br />
                <span className="text-[oklch(0.65_0.12_230)]">
                  with Bus Connect.
                </span>
              </h1>

              <p className="text-[oklch(0.78_0.04_250)] font-body text-lg leading-relaxed mb-8 max-w-lg">
                Find routes, compare scheduled departures, and explore bus
                details in one thoughtfully connected place. Start planning your
                next journey in just a few steps.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="gradient-orange text-white font-body font-semibold hover:opacity-90 shadow-lg shadow-[oklch(0.72_0.21_50/0.3)] transition-all border-0"
                  onClick={() => navigate({ to: "/find-bus" })}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Find Bus
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[oklch(0.65_0.12_230/0.3)] text-[oklch(0.65_0.12_230)] bg-white/10 hover:bg-white/18 hover:text-white font-body font-semibold transition-all"
                  onClick={() => navigate({ to: "/book-ticket" })}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Book Tickets
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[oklch(0.72_0.21_50/0.4)] text-[oklch(0.88_0.12_55)] bg-transparent hover:bg-[oklch(0.72_0.21_50/0.15)] hover:text-[oklch(0.92_0.1_55)] font-body font-semibold transition-all"
                  onClick={() => navigate({ to: "/ai-bot" })}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Ask the Assistant
                </Button>
              </div>
            </motion.div>

            {/* Right: Bus Tracking Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <SampleBusCard />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/8 border border-white/12 rounded-xl p-4 text-center"
              >
                <Icon className="w-5 h-5 text-[oklch(0.82_0.18_55)] mx-auto mb-2" />
                <p className="font-display font-bold text-2xl text-white">
                  {value}
                </p>
                <p className="text-xs text-[oklch(0.7_0.04_250)] font-body mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── About / How It Works ─────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://picsum.photos/seed/haryana-bus1/640/400"
                alt="Bus travelling along a highway"
                className="rounded-2xl shadow-xl w-full object-cover h-64"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-4 w-48">
                <img
                  src="https://picsum.photos/seed/haryana-bus2/320/240"
                  alt="Bus terminal"
                  className="rounded-xl shadow-lg border-4 border-white object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-body font-bold uppercase tracking-widest text-[oklch(0.72_0.21_50)] mb-3 block">
                How It Works
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-6 leading-tight">
                Smart Tools for
                <br />
                <span className="text-gradient-blue">Modern Commuters</span>
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Bus Connect brings route discovery, sample schedules, bus
                details, and ticket booking together, so planning a journey
                feels straightforward from the start.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Compare stops and departures, then follow a clear path from
                route search to ticket confirmation. The travel assistant can
                also point you to useful route and booking information.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                This preview uses sample routes and bus information. Live
                schedules, fleet tracking, and real ticketing depend on
                integrations with the relevant bus operators.
              </p>
            </motion.div>
          </div>

          {/* Steps */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <span className="text-xs font-body font-bold uppercase tracking-widest text-[oklch(0.72_0.21_50)] mb-3 block">
                Step by Step
              </span>
              <h2 className="font-display font-bold text-3xl text-foreground">
                Your Journey in 3 Simple Steps
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative"
                >
                  <div className="bg-card rounded-2xl p-6 border border-border h-full card-hover">
                    <span className="font-display font-black text-5xl text-[oklch(0.72_0.21_50/0.2)] block mb-4">
                      {step.step}
                    </span>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <ChevronRight className="absolute top-1/2 -right-4 -translate-y-1/2 text-muted-foreground hidden md:block w-5 h-5" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-body font-bold uppercase tracking-widest text-[oklch(0.72_0.21_50)] mb-3 block">
              Platform Features
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Made for Every Journey
            </h2>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-card rounded-xl p-6 border border-border card-hover"
              >
                <div
                  className={`w-11 h-11 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-base text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="gradient-hero py-16">
        <div className="max-w-3xl mx-auto px-4 text-center roadway-pattern">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to Plan Your Journey?
          </h2>
          <p className="text-[oklch(0.78_0.04_250)] font-body mb-8">
            Explore the sample network and see how your next journey can come
            together with Bus Connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="gradient-orange text-white font-body font-semibold border-0 hover:opacity-90 shadow-lg"
              onClick={() => navigate({ to: "/find-bus" })}
            >
              Find Bus Now
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/18 hover:text-white font-body font-semibold"
              onClick={() => navigate({ to: "/ai-bot" })}
            >
              Try AI Bot
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Sample Bus Preview Card ─────────────────────────────
function SampleBusCard() {
  const stops = ["Rohtak", "Jhajjar", "Bhiwani", "Hisar"];
  const currentIdx = 1;

  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[oklch(0.75_0.04_250)] text-xs font-body uppercase tracking-wider">
            Sample Bus Details
          </p>
          <p className="text-white font-display font-bold text-lg">
            HR-10-PA-0231
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[oklch(0.58_0.12_145/0.2)] border border-[oklch(0.58_0.12_145/0.3)] rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.65_0.18_145)] pulse-dot" />
          <span className="text-[oklch(0.75_0.15_145)] text-xs font-body font-semibold">
            Sample status
          </span>
        </div>
      </div>

      {/* Route timeline */}
      <div className="relative pl-8">
        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bus-route-line rounded-full" />
        {stops.map((stop, idx) => (
          <div
            key={stop}
            className="relative flex items-center gap-3 mb-5 last:mb-0"
          >
            <div
              className={`absolute -left-5 w-3 h-3 rounded-full border-2 z-10 ${
                idx < currentIdx
                  ? "bg-[oklch(0.58_0.12_145)] border-[oklch(0.58_0.12_145)]"
                  : idx === currentIdx
                    ? "bg-[oklch(0.72_0.21_50)] border-[oklch(0.82_0.18_55)] scale-125"
                    : "bg-transparent border-white/40"
              }`}
            />
            <div className="flex-1 flex items-center justify-between">
              <span
                className={`font-body text-sm ${
                  idx === currentIdx
                    ? "text-[oklch(0.88_0.12_55)] font-semibold"
                    : idx < currentIdx
                      ? "text-[oklch(0.65_0.04_250)]"
                      : "text-white/60"
                }`}
              >
                {stop}
              </span>
              {idx === currentIdx && (
                <span className="text-xs text-[oklch(0.82_0.18_55)] font-body bg-[oklch(0.72_0.21_50/0.2)] px-2 py-0.5 rounded-full">
                  Sample Position
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-[oklch(0.75_0.04_250)] text-xs font-body">
            Sample speed
          </p>
          <p className="text-white font-display font-bold text-xl">62 km/h</p>
        </div>
        <div className="text-center">
          <p className="text-[oklch(0.75_0.04_250)] text-xs font-body">
            Scheduled arrival · Hisar
          </p>
          <p className="text-white font-display font-bold text-xl">09:30 AM</p>
        </div>
      </div>
    </div>
  );
}
