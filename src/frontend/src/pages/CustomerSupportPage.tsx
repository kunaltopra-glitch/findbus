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
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const FAQS = [
  {
    q: "How does live bus tracking work?",
    a: "FindBus uses a combination of GPS transponders installed in Haryana Roadways buses and cell-tower triangulation to determine real-time bus locations. Our system updates every 10-30 seconds, giving you the most accurate position data possible. The AI layer processes this raw data to calculate precise ETAs based on current speed, traffic, and route patterns.",
  },
  {
    q: "Why is my bus showing a different location than expected?",
    a: "Occasional discrepancies can occur due to GPS signal loss in tunnels or dense urban areas, temporary connectivity issues with the transponder, or the bus taking a short detour due to road conditions. Data typically self-corrects within 1-2 minutes when the bus returns to coverage. If the issue persists, contact our helpline at 1800-180-2345.",
  },
  {
    q: "How do I book a ticket online?",
    a: "Booking is simple: (1) Go to the Book Ticket page, (2) Select your From and To stops, (3) Choose a bus timing that suits you, (4) Enter passenger details and preferred payment method, (5) Pay via UPI or Debit/Credit Card. You'll receive a digital ticket with a unique Ticket ID immediately after payment.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "Cancellations are free within 1 hour of booking (full refund). Between 1 hour and 2-4 hours before departure, you receive a 75% refund. Within 2 hours of departure, no refund is processed. Refunds are credited to your original payment method within 5-7 working days. Visit Customer Support or call us to initiate a cancellation.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "We accept all major UPI apps (PhonePe, Google Pay, Paytm, BHIM), Debit Cards (Visa, Mastercard, RuPay), and Credit Cards (Visa, Mastercard). Net Banking support is coming soon. All transactions are secured with 256-bit SSL encryption. Cash payment is available at bus stand ticket counters.",
  },
  {
    q: "What should I do if I miss my bus?",
    a: "If you miss your booked bus, our Missed Bus policy allows you to board the next available bus on the same route on the same day without additional charges (subject to seat availability). Show your original digital ticket to the conductor. For more assistance, contact us at 1800-180-2345 or support@findbus.hr.gov.in.",
  },
];

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Phone Support",
    info: "1800-180-2345",
    sub: "Toll Free • 24×7",
    color: "text-[oklch(0.45_0.15_145)]",
    bg: "bg-[oklch(0.92_0.08_145)]",
  },
  {
    icon: Mail,
    title: "Email Support",
    info: "support@findbus.hr.gov.in",
    sub: "Mon–Sat, 9AM–6PM",
    color: "text-[oklch(0.38_0.12_264)]",
    bg: "bg-[oklch(0.28_0.12_264/0.1)]",
  },
  {
    icon: MapPin,
    title: "Office Address",
    info: "HRTC Head Office, Bus Stand Road",
    sub: "Rohtak – 124001, Haryana",
    color: "text-[oklch(0.65_0.18_50)]",
    bg: "bg-[oklch(0.72_0.21_50/0.1)]",
  },
  {
    icon: Clock,
    title: "Office Hours",
    info: "Mon–Sat: 9:00 AM – 6:00 PM",
    sub: "Closed on Sundays & Public Holidays",
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
    toast.success("Message sent! We'll get back to you within 24 hours.");
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
              Get answers to common questions or reach out to our support team.
              We're here to help 24×7.
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
