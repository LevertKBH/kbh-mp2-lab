import "@/styles/globals.css";
import { Toaster } from "sonner";

import { type Metadata } from "next";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/providers";
import { TRPCReactProvider } from "@/trpc/react";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "MP2 Downtime",
  description: "MP2 Downtime",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = localFont({
  src: [
    {
      path: "../../public/fonts/OpenAISans-Regular.8e5ce1c0.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenAISans-Medium.75b57261.otf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../public/fonts/OpenAISans-Semibold.63de4196.otf",
      weight: "600",
      style: "semibold",
    },
  ],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontSans.variable}`} suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-svh font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <div vaul-drawer-wrapper="">
            <div className="bg-background relative flex min-h-svh flex-col">
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </div>
          </div>
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
