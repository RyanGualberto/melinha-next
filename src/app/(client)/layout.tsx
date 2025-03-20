import type React from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/assets/logo-horizontal.png";
import Image from "next/image";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
        <div className="container px-4 md:px-0 flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Image src={Logo} height={40} width={120} alt="MELINHA" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Cardápio
            </Link>
            <Link
              href="/sobre"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contato
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/carrinho">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </Link>
            <Link href="/minha-conta">
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="hidden md:block">
              <Button variant="default" size="sm">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 justify-center flex">{children}</main>

      <footer className="border-t py-6 md:py-8 justify-center flex">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <Image src={Logo} height={40} width={120} alt="MELINHA" />
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Melinha Açaíteria. Todos os
            direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link
              href="/termos"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Termos
            </Link>
            <Link
              href="/privacidade"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
