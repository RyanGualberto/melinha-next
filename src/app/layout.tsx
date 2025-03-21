import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/query-context";
import { AuthenticatedContextProvider } from "@/contexts/user-context";

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
          </AuthenticatedContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
