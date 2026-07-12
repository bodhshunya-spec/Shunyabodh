import { BrandMark } from "@/components/brand/brand-mark";
import { ContactForm } from "@/components/contact/contact-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.contact.title,
  description: ne.contact.description,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 flex justify-center">
        <BrandMark size="lg" />
      </div>

      <header className="mb-10 text-center">
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
          {ne.contact.heading}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {ne.contact.intro}
        </p>
      </header>

      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-foreground">
            {ne.contact.title}
          </CardTitle>
          <CardDescription>{ne.contact.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
