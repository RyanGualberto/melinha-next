import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/query-context";
import { AuthenticatedContextProvider } from "@/contexts/user-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Melinha Açaíteria",
  description: "Melinha Açaíteria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased`}>
        <QueryProvider>
          <AuthenticatedContextProvider>
            {children}
            <Toaster />
          </AuthenticatedContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
