import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Organizador de Horas Complementares | Gestão Acadêmica",
  description: "Centralize seus certificados, acompanhe tetos regimentais por categoria e emita o relatório oficial para a coordenação do curso.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
