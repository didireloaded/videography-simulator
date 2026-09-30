import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { SwRegister } from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "FrameLab — On-Set Field Notebook",
  description:
    "A pocket videography and photography field notebook: exposure triangle, frame rate & shutter, depth of field, shot sizes, camera movement, composition and more.",
  applicationName: "FrameLab",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "FrameLab" },
};

export const viewport: Viewport = {
  themeColor: "#f2f2f7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
          <SwRegister />
        </Providers>
      </body>
    </html>
  );
}
