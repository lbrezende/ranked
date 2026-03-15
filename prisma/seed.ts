// Add to package.json:
// "prisma": { "seed": "npx tsx prisma/seed.ts" }

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── AI Skills (CMU AI Design Kit) ─────────────────────────────────────────

const aiSkills = [
  {
    name: "Detectar",
    slug: "detectar",
    description:
      "Notar se alguma coisa especifica existe em um conjunto de dados ou se e detectada em um sensor",
    synonyms: "Monitorar, Observar, Classificar, Distinguir",
    examples:
      "Detectar faces em imagem, Detectar voz humana em audio, Detectar objetos em sensor",
    icon: "Search",
    position: 1,
  },
  {
    name: "Identificar",
    slug: "identificar",
    description:
      "Notar se algo especifico ou um tipo de item aparece em um conjunto de itens semelhantes",
    synonyms: "Reconhecer, Discernir, Encontrar, Classificar, Perceber",
    examples:
      "Identificar rosto, Identificar spam, Identificar tipo de cancer",
    icon: "Fingerprint",
    position: 2,
  },
  {
    name: "Estimar",
    slug: "estimar",
    description:
      "Inferir um valor (duracao, posicao, risco etc) a uma situacao; fazer uma inferencia baseada no que esta acontecendo agora",
    synonyms: "Dar pontuacao, Classificar, Medir, Avaliar",
    examples:
      "Estimar duracao de trajeto, Estimar chances de spam, Estimar direcao de som",
    icon: "Gauge",
    position: 3,
  },
  {
    name: "Prever",
    slug: "prever",
    description:
      "Inferir um valor que sera verdade ou algum atributo de uma situacao futura que pode ou nao ocorrer",
    synonyms: "Supor, Especular",
    examples:
      "Prever melhor momento para compra, Prever clima, Prever preco maximo",
    icon: "TrendingUp",
    position: 4,
  },
  {
    name: "Comparar",
    slug: "comparar",
    description:
      "Compare uma colecao de itens baseado em uma metrica. O servico seleciona, ranqueia ou faz uma curadoria",
    synonyms:
      "Ranquear, Ordenar, Encontrar o melhor, Encontrar o mais barato, Recomendar",
    examples:
      "Comparar itens por chances de compra, Comparar posts por engajamento, Comparar filmes por probabilidade",
    icon: "ArrowUpDown",
    position: 5,
  },
  {
    name: "Descobrir",
    slug: "descobrir",
    description:
      "Analise um conjunto de dados para descobrir padroes que permitem clusterizacao de coisas semelhantes ou identificacao dos entornos",
    synonyms:
      "Extrair, Observar, Organizar, Clusterizar, Agrupar, Conectar, Revelar",
    examples:
      "Descobrir como pessoas usam site, Descobrir transacoes suspeitas, Descobrir rotinas",
    icon: "Sparkles",
    position: 6,
  },
  {
    name: "Gerar",
    slug: "gerar",
    description:
      "Gere algo novo (mensagens, imagens, sons) baseado em conhecimentos de coisas similares",
    synonyms: "Fabricar, Compor, Construir, Criar, Ser autor",
    examples:
      "Criar respostas conversacionais, Ajustar imagens, Gerar registros medicos",
    icon: "Wand2",
    position: 7,
  },
  {
    name: "Agir",
    slug: "agir",
    description:
      "Execute estrategias para chegar em um objetivo especifico e continue a atualizar a estrategia com base no progresso",
    synonyms: "Fazer, Executar, Iniciar, Ir, Aprender, Operar",
    examples: "Estacionar carro, Jogar poquer, Conduzir drones",
    icon: "Zap",
    position: 8,
  },
  {
    name: "Monitorar",
    slug: "monitorar",
    description:
      "Acompanhar continuamente um conjunto de dados ou sensores para detectar mudancas significativas",
    synonyms: "Vigiar, Rastrear, Acompanhar",
    examples:
      "Monitorar saude de plantacoes, Monitorar transacoes bancarias, Monitorar vida selvagem",
    icon: "Activity",
    position: 9,
  },
  {
    name: "Recomendar",
    slug: "recomendar",
    description:
      "Sugerir itens, acoes ou conteudos personalizados com base no perfil e historico do usuario",
    synonyms: "Sugerir, Personalizar, Curar",
    examples:
      "Recomendar produtos, Recomendar conteudo, Recomendar acoes de investimento",
    icon: "ThumbsUp",
    position: 10,
  },
];

// ─── AI Examples (40 cards, 14 domains) ─────────────────────────────────────

const aiExamples = [
  // Ciencia
  {
    name: "Monitoramento Aereo da Vida Selvagem",
    description:
      "Permite rastrear especies animais para pesquisas ambientais e preservacao.",
    domain: "Ciencia",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "estimar",
      "descobrir",
    ]),
    position: 1,
  },
  {
    name: "Previsao do Tempo",
    description:
      "Prediz condicoes climaticas de um local e horario com base em dados atuais e historicos.",
    domain: "Ciencia",
    capabilities: JSON.stringify(["estimar", "prever"]),
    position: 2,
  },

  // Educacao
  {
    name: "Correcao Automatica de Redacoes",
    description:
      "Atribui notas a redacoes identificando atributos de texto como estilo, coerencia e organizacao.",
    domain: "Educacao",
    capabilities: JSON.stringify(["identificar", "estimar"]),
    position: 3,
  },
  {
    name: "Planos de Aula Personalizados",
    description:
      "Cria planos de aprendizado adaptados para cada estudante em cursos online massivos.",
    domain: "Educacao",
    capabilities: JSON.stringify([
      "estimar",
      "comparar",
      "descobrir",
      "gerar",
    ]),
    position: 4,
  },

  // Transporte
  {
    name: "Estacionamento Autonomo",
    description:
      "Permite que veiculos se movam sozinhos de uma via ate uma vaga.",
    domain: "Transporte",
    capabilities: JSON.stringify([
      "identificar",
      "detectar",
      "estimar",
      "gerar",
      "agir",
    ]),
    position: 5,
  },
  {
    name: "Previsao de Saida de Faixa",
    description:
      "Alerta motoristas quando o veiculo pode estar saindo involuntariamente da faixa.",
    domain: "Transporte",
    capabilities: JSON.stringify([
      "detectar",
      "estimar",
      "identificar",
      "prever",
    ]),
    position: 6,
  },
  {
    name: "Planejador de Rotas de Navegacao",
    description:
      "Gera rotas otimizadas ate o destino considerando clima, transito e bloqueios.",
    domain: "Transporte",
    capabilities: JSON.stringify(["estimar", "prever", "comparar"]),
    position: 7,
  },

  // Marketing & Vendas
  {
    name: "Visualizacao de Produtos em AR",
    description:
      "Permite visualizar produtos online em espacos fisicos usando dispositivos moveis.",
    domain: "Marketing & Vendas",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "estimar",
      "gerar",
    ]),
    position: 8,
  },
  {
    name: "Anuncios Personalizados",
    description:
      "Analisa dados de comportamento para associar anuncios ao publico ideal.",
    domain: "Marketing & Vendas",
    capabilities: JSON.stringify(["descobrir", "comparar"]),
    position: 9,
  },
  {
    name: "Analise de Uso da Web",
    description:
      "Analisa dados de navegacao para entender e otimizar a experiencia em sites.",
    domain: "Marketing & Vendas",
    capabilities: JSON.stringify(["comparar", "descobrir", "identificar"]),
    position: 10,
  },

  // Risco & Seguranca
  {
    name: "Seguranca Biometrica",
    description:
      "Garante acesso seguro por meio da verificacao de sinais biologicos de um usuario.",
    domain: "Risco & Seguranca",
    capabilities: JSON.stringify(["detectar", "identificar"]),
    position: 11,
  },
  {
    name: "Deteccao de Transacoes Fraudulentas",
    description:
      "Monitora transacoes suspeitas em setores como bancos e saude.",
    domain: "Risco & Seguranca",
    capabilities: JSON.stringify(["identificar", "estimar", "descobrir"]),
    position: 12,
  },

  // Governanca & Politicas Publicas
  {
    name: "Avaliacao de Risco Infantil",
    description:
      "Avalia a probabilidade de maus-tratos atuais ou futuros a criancas.",
    domain: "Governanca & Politicas Publicas",
    capabilities: JSON.stringify(["prever", "descobrir"]),
    position: 13,
  },
  {
    name: "Previsao de Doencas Infecciosas",
    description:
      "Prediz caracteristicas de epidemias para apoiar preparacao e mitigacao.",
    domain: "Governanca & Politicas Publicas",
    capabilities: JSON.stringify([
      "identificar",
      "estimar",
      "descobrir",
      "prever",
    ]),
    position: 14,
  },

  // Agricultura & Manufatura
  {
    name: "Monitoramento de Lavouras",
    description:
      "Monitora e acompanha a saude das plantacoes por meio de imagens aereas.",
    domain: "Agricultura & Manufatura",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "estimar",
      "prever",
    ]),
    position: 15,
  },
  {
    name: "Deteccao de Defeitos",
    description:
      "Utilizado na manufatura para monitorar produtos garantindo controle e qualidade.",
    domain: "Agricultura & Manufatura",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "estimar",
      "descobrir",
    ]),
    position: 16,
  },
  {
    name: "Robotica de Coleta e Posicionamento",
    description:
      "Acelera o processo de pegar objetos e coloca-los em outros locais em industrias.",
    domain: "Agricultura & Manufatura",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "gerar",
      "estimar",
      "agir",
    ]),
    position: 17,
  },

  // Saude
  {
    name: "Descoberta de Medicamentos",
    description:
      "Analisa relacoes entre proteinas e efeitos de medicamentos em doencas.",
    domain: "Saude",
    capabilities: JSON.stringify(["gerar", "estimar", "descobrir"]),
    position: 18,
  },
  {
    name: "Analise de Imagens Medicas",
    description:
      "Examina imagens medicas para identificar cancer e auxiliar em decisoes clinicas.",
    domain: "Saude",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "estimar",
      "descobrir",
    ]),
    position: 19,
  },
  {
    name: "Deteccao de Exercicios em Smartwatch",
    description:
      "Detecta e registra atividades fisicas como caminhada, corrida e ciclismo.",
    domain: "Saude",
    capabilities: JSON.stringify(["detectar", "identificar", "estimar"]),
    position: 20,
  },
  {
    name: "Geracao de Dados Sinteticos de Saude",
    description:
      "Cria dados medicos novos porem semelhantes ao original para pesquisa.",
    domain: "Saude",
    capabilities: JSON.stringify(["gerar"]),
    position: 21,
  },

  // Entretenimento & Midia
  {
    name: "Deepfakes",
    description:
      "Permite criar conteudo sintetico que substitui a aparencia de uma pessoa por outra.",
    domain: "Entretenimento & Midia",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "gerar",
      "estimar",
    ]),
    position: 22,
  },
  {
    name: "Jogador de Games",
    description:
      "Permite que uma IA jogue contra oponentes em jogos como xadrez ou poquer.",
    domain: "Entretenimento & Midia",
    capabilities: JSON.stringify(["comparar", "gerar", "agir"]),
    position: 23,
  },
  {
    name: "Transferencia de Estilo em Imagem",
    description:
      "Permite aplicar o estilo visual de uma imagem em outra.",
    domain: "Entretenimento & Midia",
    capabilities: JSON.stringify(["identificar", "estimar", "gerar"]),
    position: 24,
  },
  {
    name: "Feed de Midia",
    description:
      "Cria uma lista de conteudos de midia para o usuario escolher ou reproduzir.",
    domain: "Entretenimento & Midia",
    capabilities: JSON.stringify([
      "identificar",
      "estimar",
      "comparar",
      "gerar",
    ]),
    position: 25,
  },
  {
    name: "Filtros Faciais em Aplicativo Movel",
    description:
      "Permite criar conteudo aumentado em tempo real no rosto e corpo.",
    domain: "Entretenimento & Midia",
    capabilities: JSON.stringify(["detectar", "identificar", "gerar"]),
    position: 26,
  },

  // Energia & Infraestrutura
  {
    name: "Otimizacao de Energia Residencial",
    description:
      "Otimiza consumo de energia com base na rotina e preferencias dos moradores.",
    domain: "Energia & Infraestrutura",
    capabilities: JSON.stringify([
      "estimar",
      "descobrir",
      "identificar",
      "prever",
      "detectar",
      "gerar",
    ]),
    position: 27,
  },
  {
    name: "Manutencao Preditiva",
    description:
      "Constroi modelos para prever quando maquinas ou sistemas irao falhar.",
    domain: "Energia & Infraestrutura",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "prever",
      "estimar",
    ]),
    position: 28,
  },

  // Recursos Humanos & Gestao
  {
    name: "Chatbot de RH",
    description:
      "Auxilia funcionarios respondendo duvidas frequentes sobre trabalho.",
    domain: "Recursos Humanos & Gestao",
    capabilities: JSON.stringify(["identificar", "gerar", "comparar"]),
    position: 29,
  },
  {
    name: "Triagem de Curriculos",
    description:
      "Apoia recrutadores na pre-selecao de candidatos a partir de curriculos.",
    domain: "Recursos Humanos & Gestao",
    capabilities: JSON.stringify(["identificar", "comparar"]),
    position: 30,
  },
  {
    name: "Escalonamento de Equipes",
    description:
      "Cria escalas de trabalho atribuindo turnos ou clientes a funcionarios.",
    domain: "Recursos Humanos & Gestao",
    capabilities: JSON.stringify(["prever", "estimar", "gerar"]),
    position: 31,
  },

  // Financas
  {
    name: "Recomendacoes de Acoes na Bolsa",
    description:
      "Oferece insights sobre acoes lucrativas para auxiliar investidores.",
    domain: "Financas",
    capabilities: JSON.stringify(["descobrir", "prever"]),
    position: 32,
  },
  {
    name: "Processamento Robotico de Faturas",
    description:
      "Digitaliza e valida dados de pedidos de compra acelerando o processamento.",
    domain: "Financas",
    capabilities: JSON.stringify(["identificar", "detectar"]),
    position: 33,
  },

  // Produtividade & Escritorio
  {
    name: "Resumo Automatico de Reunioes",
    description:
      "Gera automaticamente transcricao e resumo de reunioes a partir do audio.",
    domain: "Produtividade & Escritorio",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "comparar",
      "gerar",
    ]),
    position: 34,
  },
  {
    name: "Traducao Automatica",
    description:
      "Gera traducoes automaticas de textos em diferentes idiomas.",
    domain: "Produtividade & Escritorio",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "comparar",
      "gerar",
    ]),
    position: 35,
  },
  {
    name: "Filtro de Spam",
    description:
      "Filtra e-mails indesejados ao identificar palavras e padroes comuns em spam.",
    domain: "Produtividade & Escritorio",
    capabilities: JSON.stringify(["estimar", "identificar"]),
    position: 36,
  },
  {
    name: "Geracao de Texto",
    description:
      "Sugere palavras ou frases enquanto o usuario digita em buscas ou editores.",
    domain: "Produtividade & Escritorio",
    capabilities: JSON.stringify(["comparar", "gerar"]),
    position: 37,
  },

  // Hospitalidade
  {
    name: "Analise de Avaliacoes de Clientes",
    description:
      "Examina avaliacoes de consumidores para gerar insights sobre comportamento.",
    domain: "Hospitalidade",
    capabilities: JSON.stringify(["identificar", "descobrir"]),
    position: 38,
  },
  {
    name: "Precificacao Inteligente",
    description:
      "Prediz o preco ideal para imoveis ou alugueis com base na demanda.",
    domain: "Hospitalidade",
    capabilities: JSON.stringify(["prever"]),
    position: 39,
  },

  // Entretenimento & Midia (cont.)
  {
    name: "Smart Speaker - Perguntas e Respostas",
    description:
      "Responde as perguntas faladas dos usuarios em tempo real.",
    domain: "Entretenimento & Midia",
    capabilities: JSON.stringify([
      "detectar",
      "identificar",
      "comparar",
      "gerar",
    ]),
    position: 40,
  },
];

// ─── Main seed function ─────────────────────────────────────────────────────

async function main() {
  console.log("Seeding AI Skills...");

  for (const skill of aiSkills) {
    await prisma.aiSkill.upsert({
      where: { slug: skill.slug },
      update: {
        name: skill.name,
        description: skill.description,
        synonyms: skill.synonyms,
        examples: skill.examples,
        icon: skill.icon,
        position: skill.position,
      },
      create: skill,
    });
  }

  console.log(`  ${aiSkills.length} AI Skills upserted.`);

  console.log("Seeding AI Examples...");

  for (const example of aiExamples) {
    await prisma.aiExample.upsert({
      where: {
        id: `seed-example-${example.position}`,
      },
      update: {
        name: example.name,
        description: example.description,
        domain: example.domain,
        capabilities: example.capabilities,
        position: example.position,
      },
      create: {
        id: `seed-example-${example.position}`,
        ...example,
      },
    });
  }

  console.log(`  ${aiExamples.length} AI Examples upserted.`);

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
