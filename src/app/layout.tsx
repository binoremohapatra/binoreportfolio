import type { Metadata } from "next";
import { fontSans, fontSerif, fontMono } from "@/lib/fonts";
import "@/styles/tokens.css";
import "@/app/globals.css";
import { Providers } from "@/providers";
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
  title: "Binore Mohapatra | Full-Stack Engineer",
  description: "Portfolio of Binore Mohapatra, Full-Stack Engineer bridging high-performance systems with immaculate design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable
        )}
      >

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
