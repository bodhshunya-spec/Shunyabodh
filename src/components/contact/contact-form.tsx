"use client";

import { useState } from "react";
import { submitContactMessage } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ne } from "@/lib/i18n/ne";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("message", message);

    const result = await submitContactMessage(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setName("");
    setEmail("");
    setMessage("");
    setSuccess(true);
    setIsPending(false);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border/70 bg-muted/80 px-6 py-10 text-center">
        <p className="font-heading text-lg leading-relaxed text-foreground/90">
          {ne.contact.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="contact-name">{ne.contact.name}</Label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={ne.contact.namePlaceholder}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">{ne.contact.email}</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={ne.contact.emailPlaceholder}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">{ne.contact.message}</Label>
        <Textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={ne.contact.messagePlaceholder}
          rows={6}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? ne.contact.submitting : ne.contact.submit}
      </Button>
    </form>
  );
}
