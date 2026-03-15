import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ranked — AI Design Kit Digital",
  description:
    "Transforme ideias em produtos AI atraves de um Kanban de 6 etapas baseado no AI Design Kit da Carnegie Mellon University.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
