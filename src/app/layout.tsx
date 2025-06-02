import "../styles/globals.css";
import Image from "next/image";

export const metadata = {
  title: "Portal de Serviços Governamentais",
  description: "Clone do site CNH Fácil Brasil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#f7fbfb] text-[#092046] min-h-screen font-sans flex flex-col">
        {/* Header */}
        <header className="shadow-md bg-white">
          <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="https://ext.same-assets.com/2670431573/423750364.png"
                alt="gov.br logotipo"
                width={80}
                height={30}
                className="h-8 w-auto"
                priority
              />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-[#092046] hover:text-[#0550ae] transition py-2">Início</a>
              <a href="#servicos" className="text-[#092046] hover:text-[#0550ae] transition py-2">Serviços</a>
              <a href="#sobre" className="text-[#092046] hover:text-[#0550ae] transition py-2">Sobre</a>
              <a href="#contato" className="text-[#092046] hover:text-[#0550ae] transition py-2">Contato</a>
            </div>
            {/* Mobile menu placeholder */}
          </nav>
        </header>
        <main className="grow">{children}</main>
        {/* Footer */}
        <footer className="bg-[#092046] text-white py-12 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <div>
                <p className="text-lg mb-2">Portal Oficial do Governo Federal</p>
                <p className="text-sm opacity-80">Ministério da Gestão e da Inovação em Serviços Públicos</p>
              </div>
            </div>
            <div className="border-t border-blue-400 mt-8 pt-8 text-center">
              <p>Governo Federal - 2024. Todos os direitos reservados</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
