import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { ne } from "@/lib/i18n/ne";

type HeaderProps = {
  userEmail?: string | null;
};

const feedLinks = [
  { href: "/articles", label: ne.nav.articles },
  { href: "/photos", label: ne.nav.photos },
  { href: "/videos", label: ne.nav.videos },
  { href: "/podcast", label: ne.nav.podcast },
];

export function Header({ userEmail }: HeaderProps) {
  return (
    <header className="premium-header">
      <div className="mx-auto flex h-[4.75rem] max-w-5xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-85"
        >
          <BrandMark size="md" />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {feedLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/consultation">{ne.nav.consultation}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contact">{ne.nav.contact}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {userEmail ? (
            <>
              <span className="hidden text-sm text-muted-foreground lg:inline">
                {userEmail}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-profile">{ne.nav.myProfile}</Link>
              </Button>
              <form action={signOut}>
                <Button variant="outline" type="submit" size="sm">
                  {ne.nav.signOut}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">{ne.nav.signIn}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">{ne.nav.join}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
