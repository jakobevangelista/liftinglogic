import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { GeistMono } from "geist/font/mono";
import { cookies } from "next/headers";
import { Suspense } from "react";
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiftingLogic",
  description: "The best way to track your team's progress.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={`${GeistMono.variable} `}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              <Suspense fallback={<span></span>}>{children}</Suspense>
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
