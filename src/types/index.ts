export const STAGES = ["DEFINE", "SKILLS", "EXAMPLES", "ABSTRACTION", "DECK", "IDEAS"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  DEFINE: "Definir Projeto",
  SKILLS: "Habilidades de IA",
  EXAMPLES: "40 Exemplos",
  ABSTRACTION: "Niveis de Abstracao",
  DECK: "Montar Deck",
  IDEAS: "Gerar Ideias",
};

export const STAGE_DESCRIPTIONS: Record<Stage, string> = {
  DEFINE: "Defina o dominio, usuario-alvo e problemas reais do seu projeto",
  SKILLS: "Estude as 10 habilidades de IA e marque as que voce entendeu",
  EXAMPLES: "Navegue pelos 40 exemplos de IA filtrando por dominio e habilidade",
  ABSTRACTION: "Visualize como as capabilities se simplificam em niveis de abstracao",
  DECK: "Selecione 10 a 15 exemplos para montar seu deck de inspiracao",
  IDEAS: "Crie conceitos de produtos AI inspirados pelo seu deck e problema",
};

export const STAGE_ICONS: Record<Stage, string> = {
  DEFINE: "FileText",
  SKILLS: "Brain",
  EXAMPLES: "LayoutGrid",
  ABSTRACTION: "GitBranch",
  DECK: "Layers",
  IDEAS: "Lightbulb",
};

export const DOMAINS = [
  "Ciencia",
  "Educacao",
  "Transporte",
  "Marketing & Vendas",
  "Risco & Seguranca",
  "Governanca & Politicas Publicas",
  "Agricultura & Manufatura",
  "Saude",
  "Entretenimento & Midia",
  "Energia & Infraestrutura",
  "Recursos Humanos & Gestao",
  "Financas",
  "Produtividade & Escritorio",
  "Hospitalidade",
] as const;

export type Domain = (typeof DOMAINS)[number];
