import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Clock,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Send,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
};

const DEMO_ROUTES_LIST = [
  "🔵 Rohtak → Jhajjar → Bhiwani → Hisar",
  "🟢 Gurugram → Manesar → Rewari → Ambala → Chandigarh",
  "🟠 Panipat → Sonipat → Bahadurgarh → Delhi",
];

const BOT_RESPONSES: Array<{
  patterns: string[];
  response: (input: string) => string;
}> = [
  {
    patterns: ["hello", "hi", "hey", "namaste", "helo"],
    response: () =>
      "Namaste! 🙏 I'm FindBus AI Assistant. I can help you track Haryana Roadways buses, check ETAs, find routes, and more. How can I assist you today?",
  },
  {
    patterns: ["help", "what can", "what do you", "features", "options"],
    response: () =>
      "I can help you with:\n\n🚌 **Bus Location** – Ask 'Where is my bus?'\n⏰ **ETA** – Ask 'When will my bus arrive?'\n🗺️ **Routes** – Ask 'Show me routes'\n📋 **Bus Info** – Ask 'Bus details for HR-10-PA-0231'\n🎫 **Booking** – Ask 'How to book a ticket?'\n\nJust type your question!",
  },
  {
    patterns: [
      "where is my bus",
      "bus location",
      "location of bus",
      "where is bus",
      "track bus",
      "bus kahan hai",
    ],
    response: () =>
      "📍 **Live Location Update:**\n\nBus HR-10-PA-0231 is currently at **Jhajjar** on Route: Rohtak → Hisar.\n\n• Distance to Hisar: ~85 km\n• Current Speed: 62 km/h\n• Next Stop: Bhiwani (ETA: 35 mins)\n\nThe bus is running ON TIME. 🟢",
  },
  {
    patterns: [
      "eta",
      "arrival time",
      "when will",
      "when does",
      "how long",
      "kitni der",
      "time",
    ],
    response: () =>
      "⏰ **Estimated Arrival Times:**\n\n🟢 HR-10-PA-0231 → Hisar: **9:30 AM** (On Time)\n🟡 HR-55-AB-1190 → Hisar: **2:15 PM** (+20 min delay)\n🟢 HR-26-AB-5567 → Chandigarh: **11:30 AM** (On Time)\n🟢 HR-07-PA-9910 → Delhi: **8:00 AM** (On Time)\n\nNote: Times update every 30 seconds based on live GPS data.",
  },
  {
    patterns: [
      "route",
      "routes",
      "path",
      "which bus",
      "available routes",
      "raasta",
    ],
    response: () =>
      `🗺️ **Available Routes:**\n\n${DEMO_ROUTES_LIST.join("\n")}\n\nAll routes have 3 daily services. Would you like timings for a specific route?`,
  },
  {
    patterns: ["rohtak", "hisar"],
    response: () =>
      "🚌 **Rohtak → Hisar Route:**\n\nStops: Rohtak → Jhajjar → Bhiwani → Hisar\n\n**Today's Buses:**\n• HR-10-PA-0231: Dep 6:00 AM | Arr 9:30 AM 🟢\n• HR-55-AB-1190: Dep 10:30 AM | Arr 2:00 PM 🟡\n• HR-29-C-4455: Dep 3:00 PM | Arr 6:30 PM 🟢\n\nShall I help you book a ticket?",
  },
  {
    patterns: ["gurugram", "chandigarh", "gurgaon"],
    response: () =>
      "🚌 **Gurugram → Chandigarh Route:**\n\nStops: Gurugram → Manesar → Rewari → Ambala → Chandigarh\n\n**Today's Buses:**\n• HR-26-AB-5567: Dep 7:00 AM | Arr 11:30 AM 🟢 (AC Volvo)\n• HR-12-CA-3301: Dep 12:00 PM | Arr 4:30 PM 🟢\n• HR-09-XB-7823: Dep 5:00 PM | Arr 9:30 PM 🟡 (+30 min delay)\n\nAC Volvo available for comfort!",
  },
  {
    patterns: ["panipat", "delhi", "bahadurgarh", "sonipat"],
    response: () =>
      "🚌 **Panipat → Delhi Route:**\n\nStops: Panipat → Sonipat → Bahadurgarh → Delhi\n\n**Today's Buses:**\n• HR-07-PA-9910: Dep 5:30 AM | Arr 8:00 AM 🟢\n• HR-44-BB-2234: Dep 11:00 AM | Arr 1:30 PM 🟢 (AC Volvo)\n• HR-19-CC-6678: Dep 4:30 PM | Arr 7:00 PM ❌ (Cancelled)\n\nNote: Evening service cancelled today.",
  },
  {
    patterns: ["book", "ticket", "booking", "reserve"],
    response: () =>
      "🎫 **How to Book a Ticket:**\n\n1. Go to **Book Ticket** page\n2. Select From and To stops\n3. Choose your bus timing\n4. Enter passenger details\n5. Pay via UPI or Card\n6. Get your digital ticket instantly!\n\n💡 **Tip:** Book at least 30 minutes before departure for guaranteed seats.",
  },
  {
    patterns: ["cancel", "refund", "cancellation"],
    response: () =>
      "🔄 **Cancellation Policy:**\n\n• Cancel within **1 hour** of booking: Full refund\n• Cancel **2-4 hours** before departure: 75% refund\n• Cancel **less than 2 hours**: No refund\n\nTo cancel: Go to **Customer Support** page or call 1800-180-2345.",
  },
  {
    patterns: ["fare", "price", "cost", "kitna", "charge"],
    response: () =>
      "💰 **Fare Structure:**\n\n🚌 Non-AC Ordinary: ₹80–₹150\n🚌 Non-AC Express: ₹120–₹250\n❄️ AC Express: ₹200–₹350\n✨ AC Volvo: ₹250–₹450\n\n*Fares are approximate. Final fare depends on distance and bus type.*",
  },
  {
    patterns: ["bus number", "hr-10", "hr-55", "hr-26", "hr-07"],
    response: (input: string) => {
      const match = input.match(/hr[-\s]?\d+[-\s]?[a-z]*[-\s]?\d+/i);
      return `🔍 **Bus Details:**\n\nBus: **${match?.[0]?.toUpperCase() ?? "HR-10-PA-0231"}**\n• Driver: DRV-2041\n• Conductor: CND-3082\n• Type: Non-AC Volvo\n• Route: Rohtak → Hisar\n• Status: 🟢 On Time\n• Current Speed: 62 km/h\n• Current Stop: Jhajjar`;
    },
  },
  {
    patterns: ["speed", "how fast", "kitni speed"],
    response: () =>
      "⚡ **Bus Speed Update:**\n\n🚌 HR-10-PA-0231: 62 km/h (Rohtak–Hisar)\n🚌 HR-26-AB-5567: 70 km/h (Gurugram–Chandigarh)\n🚌 HR-44-BB-2234: 75 km/h (Panipat–Delhi)\n\nSpeeds update in real-time from GPS transponders.",
  },
  {
    patterns: ["thank", "thanks", "shukriya", "dhanyawad"],
    response: () =>
      "You're welcome! 😊 Safe travels and have a great journey on Haryana Roadways. Is there anything else I can help you with?",
  },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const entry of BOT_RESPONSES) {
    if (entry.patterns.some((p) => lower.includes(p))) {
      return entry.response(lower);
    }
  }
  return "🤔 I'm not sure about that. Try asking:\n• 'Where is my bus?'\n• 'What is the ETA?'\n• 'Show routes'\n• 'How to book a ticket?'\n\nOr call our helpline: **1800-180-2345** for live assistance.";
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  const plain = text
    .replace(/\*\*/g, "")
    .replace(/[\p{Emoji_Presentation}]/gu, "");
  const utterance = new SpeechSynthesisUtterance(plain.slice(0, 300));
  utterance.lang = "en-IN";
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

const QUICK_QUESTIONS = [
  { icon: MapPin, text: "Where is my bus?", query: "Where is my bus?" },
  { icon: Clock, text: "Bus ETA", query: "What is the ETA?" },
  { icon: Navigation, text: "Show routes", query: "Show me all routes" },
];

export function AIBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Namaste! 🙏 I'm FindBus AI Assistant. I can help you track Haryana Roadways buses, check ETAs, find routes, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const botReply = getBotResponse(msg);
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        text: botReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (voiceEnabled) speak(botReply);
    }, delay);
  }

  function handleVoiceInput() {
    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI: any =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }

  function formatBotText(text: string): React.ReactNode {
    // Simple: strip ** markers and render with line breaks
    const cleaned = text.replace(/\*\*/g, "");
    return cleaned.split("\n").map((line, i, arr) =>
      i < arr.length - 1 ? (
        // biome-ignore lint/suspicious/noArrayIndexKey: static ordered lines
        <span key={i}>
          {line}
          <br />
        </span>
      ) : (
        // biome-ignore lint/suspicious/noArrayIndexKey: static ordered lines
        <span key={i}>{line}</span>
      ),
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
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Bot className="w-3.5 h-3.5 text-[oklch(0.82_0.18_55)]" />
              <span className="text-[oklch(0.88_0.12_55)] text-xs font-body font-semibold uppercase tracking-wider">
                AI Assistant
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
              FindBus AI Bot
            </h1>
            <p className="text-[oklch(0.75_0.04_250)] font-body max-w-xl mx-auto">
              Ask anything about bus locations, timings, routes, or bookings.
              Voice-enabled for hands-free use.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="gradient-hero p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[oklch(0.72_0.21_50)] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">
                  FindBus AI
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_145)] pulse-dot" />
                  <span className="text-[oklch(0.75_0.12_145)] text-xs font-body">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg transition-all ${
                voiceEnabled
                  ? "bg-[oklch(0.72_0.21_50)] text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
              title={voiceEnabled ? "Disable voice" : "Enable voice responses"}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-96 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-[oklch(0.28_0.12_264)] flex items-center justify-center mr-2 shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
                      msg.role === "user"
                        ? "gradient-orange text-white rounded-tr-sm"
                        : "bg-secondary text-foreground rounded-tl-sm border border-border"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <div className="whitespace-pre-line">
                        {formatBotText(msg.text)}
                      </div>
                    ) : (
                      msg.text
                    )}
                    <p
                      className={`text-xs mt-1.5 ${
                        msg.role === "user"
                          ? "text-white/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-[oklch(0.28_0.12_264)] flex items-center justify-center mr-2 shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-secondary border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Questions */}
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {QUICK_QUESTIONS.map(({ icon: Icon, text, query }) => (
              <button
                type="button"
                key={text}
                onClick={() => sendMessage(query)}
                className="flex items-center gap-1.5 text-xs font-body text-muted-foreground bg-secondary border border-border rounded-full px-3 py-1.5 hover:border-[oklch(0.72_0.21_50/0.5)] hover:text-foreground transition-all"
              >
                <Icon className="w-3 h-3" />
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening..."
                    : "Ask about bus location, ETA..."
                }
                className={`flex-1 font-body h-11 rounded-xl ${isListening ? "border-[oklch(0.72_0.21_50)] ring-2 ring-[oklch(0.72_0.21_50/0.2)]" : ""}`}
                disabled={isTyping}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={`h-11 w-11 rounded-xl shrink-0 ${isListening ? "bg-[oklch(0.72_0.21_50/0.15)] border-[oklch(0.72_0.21_50)]" : ""}`}
                onClick={handleVoiceInput}
                title="Voice input"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-[oklch(0.72_0.21_50)]" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button
                type="submit"
                className="gradient-orange text-white border-0 hover:opacity-90 h-11 w-11 rounded-xl shrink-0 p-0"
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            {voiceEnabled && (
              <p className="text-xs text-muted-foreground font-body mt-2 text-center">
                🔊 Voice responses enabled
              </p>
            )}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid sm:grid-cols-2 gap-3"
        >
          {[
            "Where is bus HR-10-PA-0231?",
            "Show me Rohtak to Hisar buses",
            "What is the fare from Gurugram to Chandigarh?",
            "How to cancel my ticket?",
          ].map((q) => (
            <button
              type="button"
              key={q}
              onClick={() => sendMessage(q)}
              className="text-left p-3 bg-card border border-border rounded-xl text-sm font-body text-muted-foreground hover:text-foreground hover:border-[oklch(0.72_0.21_50/0.4)] hover:bg-[oklch(0.72_0.21_50/0.04)] transition-all"
            >
              <span className="text-[oklch(0.72_0.21_50)] mr-1.5">→</span>
              {q}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
