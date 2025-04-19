import MenuPageStoreConfigSection from "@/components/menu/menu-page-store-config-section";
import MenuDynamicContentPage from "@/components/menu/menu-dynamic-content-page";

export default async function CardapioPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`);
  const menu = await res.json();

  return (
    <div className="container px-4 md:px-0 py-8 w-full flex-1 scroll-smooth">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cardápio</h1>
        <p className="text-muted-foreground">
          Escolha seu açaí favorito e personalize com nossas opções, frutas e
          complementos a vontade, peça agora!
        </p>
      </div>

      <MenuPageStoreConfigSection />
      <MenuDynamicContentPage menu={menu} />
    </div>
  );
}
