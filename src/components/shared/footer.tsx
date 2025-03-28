import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/assets/logo-horizontal.png";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/requests/settings";

export default function Footer() {
  const { data: storeConfig } = useQuery({
    queryKey: ["store-config"],
    queryFn: async () => await getSettings(),
  });

  return (
    <footer className="border-t py-6 md:py-8 justify-center flex">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 font-semibold">
          <Image src={Logo} height={40} width={120} alt="MELINHA" />
        </div>
        <div className="text-center">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Melinha Açaíteria. Todos os
            direitos reservados.
          </p>
          <p>
            <span className="text-xs text-muted-foreground/80">
              Desenvolvido por Gualberto Desenvolvimento de Software
            </span>
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cardápio
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sobre
          </Link>
          <Link
            href={
              "https://wa.me/55" +
              String(storeConfig?.whatsapp).replace(/\D/g, "")
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Ajuda
          </Link>
        </div>
      </div>
    </footer>
  );
}
