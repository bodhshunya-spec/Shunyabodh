import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { ShunyaBodhaLogo } from "@/components/brand/shunya-bodha-logo";
import { Button } from "@/components/ui/button";
import { ne } from "@/lib/i18n/ne";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="premium-hero-glow pointer-events-none absolute inset-0" />

      <section className="relative border-b border-border/40">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <div className="mb-10 flex justify-center">
            <div className="flex size-32 items-center justify-center rounded-2xl border border-primary/15 bg-card/80 shadow-md ring-1 ring-gold/20">
              <ShunyaBodhaLogo size={64} className="text-sage" />
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <BrandMark size="lg" showIcon={false} />
          </div>

          <div className="premium-accent-line mx-auto mb-5" />

          <p className="mb-4 text-sm tracking-[0.2em] text-sage-light uppercase">
            {ne.home.subtitle}
          </p>

          <h1 className="font-heading text-4xl leading-[1.15] text-foreground sm:text-5xl lg:text-[3.25rem]">
            {ne.home.heroTitle}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {ne.home.heroDescription}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/consultation">{ne.home.ctaConsultation}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/articles">{ne.home.ctaLearning}</Link>
            </Button>
          </div>

          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            {ne.home.heroNote}
          </p>
        </div>
      </section>

      <section className="relative border-y border-border/40 bg-gradient-to-b from-card/50 to-muted/30">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 sm:grid-cols-3">
          {ne.home.pillars.map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <div className="pillar-accent mx-auto sm:mx-0" />
              <h2 className="font-heading text-xl text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-10 text-center sm:text-left">
            <div className="premium-accent-line mb-5 sm:mx-0" />
            <h2 className="font-heading text-2xl text-foreground">
              {ne.home.feedsTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">{ne.home.feedsDescription}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {ne.home.feeds.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group surface-card surface-card-hover p-6"
              >
                <h3 className="font-heading text-lg text-foreground transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-border/40 bg-gradient-to-b from-muted/40 to-sage/[0.04]">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <ShunyaBodhaLogo size={44} className="mx-auto mb-6 text-gold-muted" />
          <h2 className="font-heading text-2xl text-foreground">
            {ne.home.closingTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {ne.home.closingDescription}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/register">{ne.home.joinCommunity}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/consultation">{ne.home.learnConsultation}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
