import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/profile.png";
import SocialMedia from "@/components/about/social-media";
import PaymentMethods from "@/components/about/payment-methods";
import WorkHours from "@/components/about/work-hours";

export default function SobrePage() {
  return (
    <div className="container  py-8 md:py-12 md:pt-24 px-4 md:px-0 relative">
      <div className="flex flex-col items-center text-center mb-12 ">
        <Image
          src={Logo}
          height={160}
          width={160}
          alt="MELINHA"
          className="border border-white"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <WorkHours />
        <SocialMedia />
        <PaymentMethods />
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
        <Button
          asChild
          size="lg"
          className="bg-[#73067D] hover:bg-[#73067D]/80"
        >
          <Link href="/">Ver Cardápio</Link>
        </Button>
      </div>
    </div>
  );
}
