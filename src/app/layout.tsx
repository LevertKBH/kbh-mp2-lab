import "@/styles/globals.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

import { type Metadata } from "next";

import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "MP2 Lab Results",
  description: "MP2 Lab Results",
  icons: [{ rel: "icon", url: "/favicon.png" }],
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${fontSans.variable}`} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-svh bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
