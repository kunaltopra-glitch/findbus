import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "signup";
type Role = "Passenger" | "Staff" | "ETIM";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("Passenger");

  // Common fields
  const [identifier, setIdentifier] = useState(""); // username | phone | email | machineId
  const [password, setPassword] = useState("");

  // Signup-specific
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [staffType, setStaffType] = useState<"Driver" | "Conductor">("Driver");
  const [staffId, setStaffId] = useState("");
  const [etimId, setEtimId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        (async () => {
          try {
            const uref = doc(db, "users", user.uid);
            const snap = await getDoc(uref);
            const role = snap.exists() ? (snap.data() as any).role : null;
            if (role === "Staff") navigate({ to: "/staff" });
            else if (role === "ETIM") navigate({ to: "/etim" });
            else navigate({ to: "/home" });
          } catch (e) {
            navigate({ to: "/home" });
          }
        })();
      }
    });
    return () => unsub();
  }, [navigate]);

  // Resolve identifier to an email (for Passenger login that can use username/phone/email)
  async function resolveEmailForIdentifier(id: string, r: Role) {
    // If it's already an email
    if (id.includes("@")) return id;
    // For ETIM, identifier is machineId and will be stored under role ETIM
    const usersRef = collection(db, "users");
    let q;
    if (r === "Passenger") {
      q = query(usersRef, where("username", "==", id));
      let snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data().email as string;
      q = query(usersRef, where("phone", "==", id));
      snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data().email as string;
    }
    if (r === "Staff") {
      // staff can also login by username or email
      q = query(usersRef, where("staffId", "==", id));
      let snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data().email as string;
      q = query(usersRef, where("email", "==", id));
      snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data().email as string;
    }
    if (r === "ETIM") {
      q = query(usersRef, where("etimId", "==", id));
      let snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data().email as string;
      q = query(usersRef, where("machineId", "==", id));
      snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data().email as string;
    }
    return null;
  }

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let resolvedEmail = await resolveEmailForIdentifier(identifier, role);
      if (!resolvedEmail) {
        // If user supplied an email directly and resolution failed, and identifier looks like email, try it
        if (identifier.includes("@")) resolvedEmail = identifier;
      }
      if (!resolvedEmail) throw new Error("Could not find an account for that identifier.");

      await signInWithEmailAndPassword(auth, resolvedEmail, password);
      // onAuthStateChanged will redirect
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!email) throw new Error("Email is required for signup.");
      // Create auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Save profile in users collection
      const uref = doc(db, "users", cred.user.uid);
      const payload: any = { role, email, name };
      if (role === "Passenger") {
        payload.username = identifier || null;
        payload.phone = identifier && !identifier.includes("@") ? identifier : null;
      }
      if (role === "Staff") {
        payload.staffType = staffType;
        payload.staffId = staffId || null;
      }
      if (role === "ETIM") {
        payload.etimId = etimId || null;
        payload.machineId = etimId || null; // Keep machineId for backward compatibility
      }
      await setDoc(uref, payload);
      // auto-login on signup
      // onAuthStateChanged will redirect
    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-xl p-6 border border-border">
        <h2 className="font-display font-bold text-2xl mb-2">Sign in to FindBus</h2>
        <p className="text-sm text-muted-foreground mb-4">Select role and sign in or create an account.</p>

        <div className="flex gap-2 mb-4">
          {(["Passenger", "Staff", "ETIM"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${role === r ? "bg-[oklch(0.72_0.21_50/0.14)]" : "bg-transparent"}`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode("login")} className={`flex-1 py-2 rounded ${mode === "login" ? "gradient-orange text-white" : "border"}`}>Login</button>
          <button onClick={() => setMode("signup")} className={`flex-1 py-2 rounded ${mode === "signup" ? "gradient-orange text-white" : "border"}`}>Create Account</button>
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="text-xs text-muted-foreground">Full name</label>
              <Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
            </div>
          )}

          {mode === "login" ? (
            <div>
              <label className="text-xs text-muted-foreground">{role === "ETIM" ? "Machine ID" : role === "Staff" ? "Staff ID / Email" : "Username / Phone / Email"}</label>
              <Input value={identifier} onChange={(e) => setIdentifier((e.target as HTMLInputElement).value)} />
            </div>
          ) : (
            <>
              {role === "Passenger" && (
                <div>
                  <label className="text-xs text-muted-foreground">Username / Phone / Email</label>
                  <Input value={identifier} onChange={(e) => setIdentifier((e.target as HTMLInputElement).value)} />
                </div>
              )}
              {role === "Staff" && (
                <div>
                  <label className="text-xs text-muted-foreground">Staff ID</label>
                  <Input value={staffId} onChange={(e) => setStaffId((e.target as HTMLInputElement).value)} placeholder="Enter your staff ID" />
                </div>
              )}
              {role === "ETIM" && (
                <div>
                  <label className="text-xs text-muted-foreground">ETIM ID</label>
                  <Input value={etimId} onChange={(e) => setEtimId((e.target as HTMLInputElement).value)} placeholder="Enter your ETIM ID" />
                </div>
              )}
            </>
          )}

          {mode === "signup" && (
            <div>
              <label className="text-xs text-muted-foreground">Email (required)</label>
              <Input value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} />
            </div>
          )}

          {role === "Staff" && (
            <div>
              <label className="text-xs text-muted-foreground">Staff Type</label>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setStaffType("Driver")} className={`px-2 py-1 rounded ${staffType === "Driver" ? "bg-[oklch(0.72_0.21_50/0.14)]" : "border"}`}>Driver</button>
                <button type="button" onClick={() => setStaffType("Conductor")} className={`px-2 py-1 rounded ${staffType === "Conductor" ? "bg-[oklch(0.72_0.21_50/0.14)]" : "border"}`}>Conductor</button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>{mode === "login" ? "Login" : "Create Account"}</Button>
            {mode === "login" && (
              <Button variant="outline" onClick={async () => { await signOut(auth); setIdentifier(""); setPassword(""); }} className="px-3">Sign Out</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
