import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const FAQS = [
  {
    q: "Does this preview show live bus tracking?",
    a: "No. Bus Connect currently uses sample routes, schedules, and bus details. It is not connected to live GPS or bus-operator systems.",
  },
  {
    q: "Can I book a real ticket here?",
    a: "The booking and payment screens demonstrate the ticket flow only. They do not reserve a seat, charge a payment method, or issue a valid travel ticket.",
  },
  {
    q: "How do I explore a route?",
    a: "Open Find Bus or Book Ticket, choose a boarding stop and destination, then select one of the scheduled departures in the sample network.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "This preview does not make bookings or process cancellations and refunds. For an actual journey, check the policies of the bus operator or ticket provider you book with.",
  },
  {
    q: "Does the payment screen charge me?",
    a: "No. Payment is simulated for this demo. No card or UPI transaction is submitted.",
  },
  {
    q: "What should I do if I miss my bus?",
    a: "This preview does not issue valid tickets or provide operator support. Contact the bus operator or ticket provider for help with an actual journey.",
  },
];

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: "Routes & stops",
    info: "Explore the sample network",
    sub: "Choose a route to see its stops",
    color: "text-[oklch(0.45_0.15_145)]",
    bg: "bg-[oklch(0.92_0.08_145)]",
  },
  {
    icon: MessageSquare,
    title: "Booking flow",
    info: "Try the ticket demo",
    sub: "No real payment is processed",
    color: "text-[oklch(0.38_0.12_264)]",
    bg: "bg-[oklch(0.28_0.12_264/0.1)]",
  },
  {
    icon: Mail,
    title: "Contact form",
    info: "Preview only",
    sub: "Messages are not sent to a team",
    color: "text-[oklch(0.65_0.18_50)]",
    bg: "bg-[oklch(0.72_0.21_50/0.1)]",
  },
  {
    icon: Clock,
    title: "Sample schedules",
    info: "Illustrative departures",
    sub: "Confirm real times with the operator",
    color: "text-[oklch(0.55_0.12_264)]",
    bg: "bg-[oklch(0.28_0.12_264/0.08)]",
  },
];

export function CustomerSupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Demo message submitted. It was not sent to a support team.");
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
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
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <MessageSquare className="w-3.5 h-3.5 text-[oklch(0.82_0.18_55)]" />
              <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold uppercase tracking-wider">
                Customer Support
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
              How Can We Help You?
            </h1>
            <p className="text-[oklch(0.75_0.04_250)] font-body max-w-xl mx-auto">
              Find answers about routes and the booking demo. This preview is
              not connected to a live support team.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {CONTACT_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
            >
              <Card className="border-border text-center card-hover h-full">
                <CardContent className="p-5">
                  <div
                    className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mx-auto mb-3`}
                  >
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm font-body font-medium text-foreground mb-0.5">
                    {card.info}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {card.sub}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-[oklch(0.72_0.21_50)]" />
              <h2 className="font-display font-bold text-xl text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.q}
                  value={faq.q.slice(0, 30)}
                  className="bg-card border border-border rounded-xl px-4 overflow-hidden"
                >
                  <AccordionTrigger className="font-body font-semibold text-sm text-left py-4 hover:no-underline hover:text-[oklch(0.65_0.18_50)]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-body text-sm leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-[oklch(0.38_0.12_264)]" />
              <h2 className="font-display font-bold text-xl text-foreground">
                Send Us a Message
              </h2>
            </div>
            <Card className="shadow-md border-border">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base text-muted-foreground font-normal">
                  We typically respond within 24 business hours.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="font-body h-11"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Email Address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="font-body h-11"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Message</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue or question in detail..."
                      className="font-body min-h-[120px] resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-orange text-white font-body font-semibold border-0 hover:opacity-90 h-12"
                    disabled={submitting || submitted}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : submitted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
