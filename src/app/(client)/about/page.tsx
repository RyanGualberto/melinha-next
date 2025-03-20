import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Instagram,
  Phone,
  CreditCard,
  Banknote,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/assets/profile.png";

export default function SobrePage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <Image src={Logo} height={160} width={160} alt="MELINHA" />
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Melinha Açaíteria
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          O melhor açaí da cidade, com sabor e qualidade que você merece
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Horários de Funcionamento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <Clock className="mr-2 h-5 w-5 text-purple-600" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Sexta e Sábado:</span>
                <span>18:00 até 00:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Domingo:</span>
                <span>16:00 até 22:00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Segunda a Quinta:</span>
                <span>Fechado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <ExternalLink className="mr-2 h-5 w-5 text-purple-600" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link
                href="https://instagram.com/melinha.acai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <Instagram className="mr-3 h-5 w-5 text-pink-600" />
                <div>
                  <p className="font-medium">Instagram</p>
                  <p className="text-sm text-muted-foreground">@melinha.acai</p>
                </div>
              </Link>

              <Link
                href="https://wa.me/5513991647970"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <Phone className="mr-3 h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    +55 (13) 99164-7970
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pagamento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
              Métodos de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 rounded-md border">
                <Banknote className="h-8 w-8 mb-2 text-green-600" />
                <span className="text-sm font-medium">Dinheiro</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-md border">
                <CreditCard className="h-8 w-8 mb-2 text-blue-600" />
                <span className="text-sm font-medium">Cartão</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-md border">
                <QrCode className="h-8 w-8 mb-2 text-purple-600" />
                <span className="text-sm font-medium">PIX</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md">
              <p className="text-sm font-medium flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                Pedido Mínimo: R$5,00
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Experimente Agora!
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Venha conhecer nosso açaí e descubra por que somos a escolha preferida
          dos amantes de açaí na cidade.
        </p>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href="/">Ver Cardápio</Link>
        </Button>
      </div>
    </div>
  );
}
