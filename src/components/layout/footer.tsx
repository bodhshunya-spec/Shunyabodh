import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { ne } from "@/lib/i18n/ne";

export function Footer() {
  const links = [
    { href: "/articles", label: ne.footer.articles },
    { href: "/photos", label: ne.footer.photos },
    { href: "/videos", label: ne.footer.videos },
    { href: "/podcast", label: ne.footer.podcast },
    { href: "/consultation", label: ne.footer.consultation },
    { href: "/contact", label: ne.footer.contact },
  ];

  return (
    <footer className="premium-footer mt-auto border-t border-border/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-12 sm:flex-row sm:justify-between">
        <BrandMark size="sm" showIcon={false} />

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border/40 px-6 py-5 text-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {ne.footer.tagline}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} {ne.site.nameNe}. {ne.footer.rights}
        </p>
      </div>
    </footer>
  );
}
