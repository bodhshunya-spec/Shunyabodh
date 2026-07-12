import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { ne } from "@/lib/i18n/ne";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${ne.site.nameEn} — ${ne.site.tagline}`,
    template: `%s | ${ne.site.nameEn}`,
  },
  description: ne.site.description,
  icons: {
    icon: "/shunya-bodha-logo.png",
    apple: "/shunya-bodha-logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="ne"
      className={`${dmSans.variable} ${cormorant.variable} ${notoDevanagari.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="premium-shell min-h-full flex flex-col" suppressHydrationWarning>
        <Header userEmail={user?.email} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
