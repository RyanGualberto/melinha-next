import type { Metadata, Viewport } from "next";
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
  manifest: "/manifest.json",
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

// ⚡️ Agora o themeColor vem aqui:
export const viewport: Viewport = {
  themeColor: "#692eff",
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
