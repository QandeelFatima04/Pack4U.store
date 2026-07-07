"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/submit-lead";
import { WhatsAppButton } from "@/components/whatsapp-button";

/**
 * Sanitize a phone number as the user types.
 * - Keeps a single leading "+" (international) plus digits only.
 * - Caps length by prefix so the number can't exceed a valid size:
 *   local "03xxxxxxxxx" = 11 digits; international "+92xxxxxxxxxx" = up to 12 digits.
 */
function sanitizePhone(raw: string): string {
  const hasPlus = raw.trimStart().startsWith("+");
  let digits = raw.replace(/\D/g, "");

  let maxDigits: number;
  if (hasPlus || digits.startsWith("92")) {
    // Country code (92) + national number (10 digits).
    maxDigits = 12;
  } else {
    // Local format, e.g. 03045300300.
    maxDigits = 11;
  }
  digits = digits.slice(0, maxDigits);

  return hasPlus ? `+${digits}` : digits;
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [phone, setPhone] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const res = await submitLead({
      type: "contact",
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      message: String(fd.get("message") || ""),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      toast.success("Thanks! We'll be in touch shortly.");
    } else {
      toast.error(res.error ?? "Something went wrong.");
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-secondary/40 p-8 text-center">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
          Message received 🌱
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll reply soon. For a faster response, message us on WhatsApp.
        </p>
        <div className="mt-5 flex justify-center">
          <WhatsAppButton source="contact-success" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" name="company" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="03045300300 or +923045300300"
            value={phone}
            onChange={(e) => setPhone(sanitizePhone(e.target.value))}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" name="message" rows={4} required />
      </div>
      <p className="text-xs text-muted-foreground">
        Provide an email or phone so we can reach you.
      </p>
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
