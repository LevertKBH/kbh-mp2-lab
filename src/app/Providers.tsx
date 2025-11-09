"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/providers/providers";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </SessionProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}