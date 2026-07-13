import Link from "next/link";
import { ShunyaBodhaLogo } from "@/components/brand/shunya-bodha-logo";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.consultation.title,
  description: ne.consultation.description,
};

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 flex justify-center">
        <ShunyaBodhaLogo size={64} />
      </div>

      <header className="text-center">
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
          {ne.consultation.heading}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {ne.consultation.intro}
        </p>
      </header>

      <Card className="mt-12 border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-foreground">
            {ne.consultation.cardTitle}
          </CardTitle>
          <CardDescription>{ne.consultation.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {ne.consultation.cardNote}
          </p>
          <ContactForm
            source="consultation"
            submitLabel={ne.consultation.sendMessage}
            messagePlaceholder={ne.consultation.messagePlaceholder}
          />
        </CardContent>
      </Card>

      <div className="mt-10 text-center">
        <Button variant="ghost" asChild>
          <Link href="/articles">{ne.consultation.orBegin}</Link>
        </Button>
      </div>
    </div>
  );
}
