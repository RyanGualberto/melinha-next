import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/query-context";
import { AuthenticatedContextProvider } from "@/contexts/user-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Melinha Açaíteria",
  description:
    "Página principal da Melinha Açaíteria, faça seu pedido agora mesmo",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/profile.png",
        width: 400,
        height: 400,
      },
    ],
  },
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
