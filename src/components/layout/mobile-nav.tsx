"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { ne } from "@/lib/i18n/ne";

type MobileNavProps = {
  userEmail?: string | null;
};

const navLinks = [
  { href: "/articles", label: ne.nav.articles },
  { href: "/photos", label: ne.nav.photos },
  { href: "/videos", label: ne.nav.videos },
  { href: "/podcast", label: ne.nav.podcast },
  { href: "/consultation", label: ne.nav.consultation },
  { href: "/contact", label: ne.nav.contact },
];

export function MobileNav({ userEmail }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? ne.nav.closeMenu : ne.nav.openMenu}
        className="px-2"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-x-0 top-[4.75rem] bottom-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />

          <nav
            id="mobile-nav-panel"
            className="fixed inset-x-0 top-[4.75rem] z-50 max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-b border-border/60 bg-card/95 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="mx-auto max-w-5xl space-y-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="block rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-3 border-t border-border/60" />

              {userEmail ? (
                <div className="space-y-1">
                  <p className="truncate px-3 py-1 text-xs text-muted-foreground">
                    {userEmail}
                  </p>
                  <Link
                    href="/my-profile"
                    onClick={close}
                    className="block rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-muted"
                  >
                    {ne.nav.myProfile}
                  </Link>
                  <form action={signOut} className="px-3 pt-1">
                    <Button
                      variant="outline"
                      type="submit"
                      className="w-full"
                      onClick={close}
                    >
                      {ne.nav.signOut}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3 pt-1">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={close}>
                      {ne.nav.signIn}
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register" onClick={close}>
                      {ne.nav.join}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
