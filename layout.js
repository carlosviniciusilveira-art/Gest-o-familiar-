import "./globals.css";

export const metadata = {
  title: "Gestão Familiar",
  description: "Controle simples de entradas e saídas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}