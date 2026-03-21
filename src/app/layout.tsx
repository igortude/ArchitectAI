import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArchitectAI - Arquiteto de Software Senior",
  description: "Sistema de análise de código e recomendação de modelos de IA. Analisa problemas, identifica bugs e sugere o modelo mais eficiente em tokens.",
  keywords: ["Arquiteto de Software", "Análise de Código", "IA", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "ArchitectAI Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ArchitectAI",
    description: "Arquiteto de Software Senior com IA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchitectAI",
    description: "Arquiteto de Software Senior com IA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
