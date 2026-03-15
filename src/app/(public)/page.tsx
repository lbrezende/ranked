"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Sparkles,
  FileText,
  Brain,
  LayoutGrid,
  GitBranch,
  Layers,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  Check,
  Users,
  Palette,
  GraduationCap,
  Rocket,
  BookOpen,
  Zap,
  Star,
  ExternalLink,
  Filter,
  PieChart,
  ThumbsUp,
  Trophy,
  Search,
  Fingerprint,
  Gauge,
  TrendingUp,
  ArrowUpDown,
  Wand2,
  Activity,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";
import { GlowyWavesHero } from "@/components/ui/glowy-waves-hero";
import { AbstractionSankey } from "@/components/ui/abstraction-sankey";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const easeOut: [number, number, number, number] = [0, 0, 0.2, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SKILLS_PREVIEW = [
  {
    icon: Search,
    name: "Detectar",
    desc: "Identificar presenca ou existencia de algo no ambiente.",
    color: "bg-blue-100 text-blue-600",
    synonyms: ["Sense", "Spot", "Notice"],
  },
  {
    icon: Fingerprint,
    name: "Identificar",
    desc: "Reconhecer e classificar entidades especificas.",
    color: "bg-purple-100 text-purple-600",
    synonyms: ["Recognize", "Classify", "Label"],
  },
  {
    icon: TrendingUp,
    name: "Prever",
    desc: "Antecipar eventos ou resultados futuros com base em padroes.",
    color: "bg-teal-100 text-teal-600",
    synonyms: ["Forecast", "Anticipate", "Project"],
  },
  {
    icon: Wand2,
    name: "Gerar",
    desc: "Criar conteudo, artefatos ou saidas novas a partir de dados.",
    color: "bg-emerald-100 text-emerald-600",
    synonyms: ["Create", "Produce", "Synthesize"],
  },
  {
    icon: Sparkles,
    name: "Descobrir",
    desc: "Revelar padroes ocultos, relacoes e insights em dados.",
    color: "bg-indigo-100 text-indigo-600",
    synonyms: ["Uncover", "Mine", "Extract"],
  },
  {
    icon: ThumbsUp,
    name: "Recomendar",
    desc: "Sugerir opcoes personalizadas e relevantes para o usuario.",
    color: "bg-orange-100 text-orange-600",
    synonyms: ["Suggest", "Curate", "Advise"],
  },
];

const EXAMPLES_PREVIEW = [
  {
    domain: "Saude",
    title: "Analise de Imagens Medicas",
    desc: "IA que detecta anomalias em raio-X e ressonancia, identificando tumores com precisao superior a radiologistas.",
    capabilities: ["detectar", "identificar", "estimar"],
  },
  {
    domain: "Financas",
    title: "Trading Algoritmico",
    desc: "Sistema que preve picos de preco de acoes e descobre correlacoes entre noticias e mercado financeiro.",
    capabilities: ["prever", "descobrir"],
  },
  {
    domain: "Transporte",
    title: "Estacionamento Autonomo",
    desc: "Veiculo que detecta vagas, estima espacos e gera trajetoria para estacionar automaticamente.",
    capabilities: ["detectar", "estimar", "gerar", "agir"],
  },
  {
    domain: "Educacao",
    title: "Tutor Inteligente",
    desc: "Plataforma que identifica gaps de conhecimento e recomenda conteudo personalizado para cada aluno.",
    capabilities: ["identificar", "recomendar", "estimar"],
  },
  {
    domain: "Varejo",
    title: "Recomendacao de Produtos",
    desc: "Engine que descobre preferencias de compra e sugere produtos com base no historico e contexto.",
    capabilities: ["descobrir", "recomendar", "comparar"],
  },
  {
    domain: "Seguranca",
    title: "Monitoramento por Video",
    desc: "Sistema de vigilancia que detecta atividades suspeitas e identifica individuos em tempo real.",
    capabilities: ["detectar", "identificar", "monitorar"],
  },
];

const STEPS = [
  {
    num: 1,
    icon: FileText,
    title: "Definir Projeto",
    desc: "Defina dominio, usuario-alvo e problemas reais. O contexto aparece fixo durante todo o fluxo.",
  },
  {
    num: 2,
    icon: Brain,
    title: "Estudar Habilidades de IA",
    desc: "10 cards de habilidades: Detectar, Identificar, Estimar, Prever, Comparar, Descobrir, Gerar, Agir.",
  },
  {
    num: 3,
    icon: LayoutGrid,
    title: "Navegar 40 Exemplos",
    desc: "Galeria de 40 exemplos reais de IA em 14 dominios. Filtre por dominio e por habilidade.",
  },
  {
    num: 4,
    icon: GitBranch,
    title: "Niveis de Abstracao",
    desc: "Visualize como capabilities especificas se abstraem em padroes reutilizaveis.",
  },
  {
    num: 5,
    icon: Layers,
    title: "Montar o Deck",
    desc: "Selecione 10-15 exemplos para seu deck de inspiracao. Veja a cobertura das 10 habilidades.",
  },
  {
    num: 6,
    icon: Lightbulb,
    title: "Gerar Ideias",
    desc: "Board de post-its para criar conceitos. Combine problema + deck + habilidades de IA.",
  },
];

const PERSONAS = [
  {
    icon: Trophy,
    title: "Product Managers",
    desc: "Priorize features de IA com base em capacidades reais, nao em hype. Saia da reuniao com conceitos fundamentados.",
  },
  {
    icon: Palette,
    title: "UX Designers",
    desc: "Entenda o que a IA pode fazer antes de desenhar interfaces. Conecte necessidades do usuario com tecnologia.",
  },
  {
    icon: GraduationCap,
    title: "Professores e Facilitadores",
    desc: "Guie workshops de ideacao de IA com uma metodologia validada por pesquisa academica da CMU.",
  },
  {
    icon: Rocket,
    title: "Times de Inovacao",
    desc: "Saia da reuniao com conceitos priorizados, votados e fundamentados em capacidades reais de IA.",
  },
];

const CAPABILITY_COLORS: Record<string, string> = {
  detectar: "bg-blue-100 text-blue-700",
  identificar: "bg-purple-100 text-purple-700",
  estimar: "bg-amber-100 text-amber-700",
  prever: "bg-teal-100 text-teal-700",
  comparar: "bg-pink-100 text-pink-700",
  descobrir: "bg-indigo-100 text-indigo-700",
  gerar: "bg-emerald-100 text-emerald-700",
  agir: "bg-red-100 text-red-700",
  monitorar: "bg-cyan-100 text-cyan-700",
  recomendar: "bg-orange-100 text-orange-700",
};

/* ------------------------------------------------------------------ */
/*  Header (dSign style)                                                */
/* ------------------------------------------------------------------ */

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full font-poppins transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0075FF]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#002834]">
            Ranked
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#como-funciona"
            className="text-sm font-medium text-[#7D82A1] transition-colors hover:text-[#002834]"
          >
            Como funciona
          </a>
          <a
            href="#habilidades"
            className="text-sm font-medium text-[#7D82A1] transition-colors hover:text-[#002834]"
          >
            Habilidades
          </a>
          <a
            href="#exemplos"
            className="text-sm font-medium text-[#7D82A1] transition-colors hover:text-[#002834]"
          >
            Exemplos
          </a>
          <a
            href="#precos"
            className="text-sm font-medium text-[#7D82A1] transition-colors hover:text-[#002834]"
          >
            Precos
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[#7D82A1] transition-colors hover:text-[#002834]"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="leafbutton bg-[#0075FF] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0063d9] hover:shadow-lg hover:shadow-[#0075FF]/25"
          >
            Comecar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Section (dSign stats bar)                                     */
/* ------------------------------------------------------------------ */

function StatsSection() {
  const stats = [
    { value: "85%", label: "Projetos de IA que falham" },
    { value: "40", label: "Exemplos reais em 14 dominios" },
    { value: "10", label: "Habilidades de IA mapeadas" },
    { value: "6", label: "Etapas do Kanban" },
  ];

  return (
    <section className="relative py-16 font-poppins">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center"
            >
              <div className="mb-2 text-4xl font-extrabold text-[#002834] sm:text-5xl">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-[#7D82A1]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Skills Section (dSign services style)                               */
/* ------------------------------------------------------------------ */

function SkillsSection() {
  return (
    <section id="habilidades" className="relative scroll-mt-20 py-20 font-poppins sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-5">
          {/* Left column: text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="lg:col-span-2"
          >
            <motion.div
              variants={fadeUp}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0075FF]/10 px-4 py-1.5 text-sm font-medium text-[#0075FF]"
            >
              <Brain className="h-4 w-4" />
              Catalogo de IA
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mb-4 text-3xl font-extrabold tracking-tight text-[#002834] sm:text-4xl"
            >
              As 10 Habilidades de IA
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed text-[#7D82A1]">
              Cada habilidade representa uma capacidade fundamental da
              Inteligencia Artificial. Entenda o que a IA pode realmente fazer
              antes de propor solucoes.
            </motion.p>
            <motion.div variants={fadeUp}>
              <a
                href="#exemplos"
                className="leafbutton inline-flex items-center gap-2 bg-[#0075FF] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0063d9] hover:shadow-lg hover:shadow-[#0075FF]/25"
              >
                Explorar todas
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right column: skill cards grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid gap-5 sm:grid-cols-2 lg:col-span-3"
          >
            {SKILLS_PREVIEW.map((skill) => (
              <motion.div
                key={skill.name}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-white p-6 shadow-xl transition-all hover:shadow-2xl"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${skill.color}`}
                >
                  <skill.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#002834]">
                  {skill.name}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-[#7D82A1]">
                  {skill.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.synonyms.map((syn) => (
                    <span
                      key={syn}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-[#7D82A1]"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Examples Section                                                    */
/* ------------------------------------------------------------------ */

function ExamplesSection() {
  return (
    <section id="exemplos" className="relative scroll-mt-20 bg-[#FAFAFE] py-20 font-poppins sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F97316]/10 px-4 py-1.5 text-sm font-medium text-[#F97316]"
          >
            <LayoutGrid className="h-4 w-4" />
            Galeria de Exemplos
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-[#002834] sm:text-4xl md:text-5xl"
          >
            40 Exemplos em 14 Dominios
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-base text-[#7D82A1]">
            De monitoramento de vida selvagem a chatbots de RH. Cada exemplo
            detalha quais capacidades de IA utiliza e como.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {EXAMPLES_PREVIEW.map((example) => (
            <motion.div
              key={example.title}
              variants={scaleIn}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white p-6 shadow-xl transition-all hover:shadow-2xl"
            >
              <span className="mb-4 inline-block rounded-full bg-[#E2F3F9] px-3 py-1 text-xs font-semibold text-[#183B56]">
                {example.domain}
              </span>
              <h3 className="mb-2 text-lg font-bold text-[#002834]">
                {example.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-[#7D82A1]">
                {example.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {example.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      CAPABILITY_COLORS[cap] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12 text-center"
        >
          <Link
            href="/login"
            className="leafbutton inline-flex items-center gap-2 bg-[#0075FF] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0063d9] hover:shadow-lg hover:shadow-[#0075FF]/25"
          >
            Ver todos os 40 exemplos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Abstraction Section                                                 */
/* ------------------------------------------------------------------ */

function AbstractionSection() {
  return (
    <section className="relative py-20 font-poppins sm:py-28" style={{ backgroundColor: "#E2F3F9" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-12 text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-sm font-medium text-[#7C3AED]"
          >
            <GitBranch className="h-4 w-4" />
            Niveis de Abstracao
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-[#002834] sm:text-4xl md:text-5xl"
          >
            Como as Habilidades se Conectam
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-base text-[#7D82A1]">
            Visualize como capacidades especificas de IA se abstraem em padroes
            reutilizaveis entre dominios totalmente diferentes. E aqui que a
            inovacao acontece.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <AbstractionSankey />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works — 6 Etapas do Kanban (dSign "why we best" style)       */
/* ------------------------------------------------------------------ */

function HowItWorksSection() {
  return (
    <section id="como-funciona" className="relative scroll-mt-20 py-20 font-poppins sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* Left: illustration / visual */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="relative"
          >
            <motion.div
              variants={fadeUp}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0075FF]/10 px-4 py-1.5 text-sm font-medium text-[#0075FF]"
            >
              <Zap className="h-4 w-4" />
              Metodologia validada
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mb-4 text-3xl font-extrabold tracking-tight text-[#002834] sm:text-4xl"
            >
              6 Etapas do Kanban
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed text-[#7D82A1]">
              Cada etapa foi desenhada para expandir seu repertorio sobre IA e
              gerar conceitos fundamentados. Do problema a ideia validada em 6
              passos claros.
            </motion.p>

            {/* Visual: 6 step mini-cards */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {STEPS.map((step) => (
                <motion.div
                  key={step.num}
                  variants={scaleIn}
                  className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-md"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0075FF]/10 text-[#0075FF]">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#002834] leading-tight">
                    {step.title}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: steps list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-6"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="flex gap-4"
              >
                {/* Number + check circle */}
                <div className="flex flex-col items-center">
                  <div className="circlebg flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Check className="h-5 w-5 text-emerald-600" />
                  </div>
                  {step.num < 6 && (
                    <div className="mt-2 h-full w-px bg-gray-200" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6">
                  <div className="mb-1 text-xs font-semibold text-[#0075FF]">
                    Etapa {step.num}
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-[#002834]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#7D82A1]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Personas Section                                                    */
/* ------------------------------------------------------------------ */

function PersonasSection() {
  return (
    <section className="relative py-20 font-poppins sm:py-28" style={{ backgroundColor: "#FAFAFE" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700"
          >
            <Users className="h-4 w-4" />
            Publico
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-[#002834] sm:text-4xl md:text-5xl"
          >
            Para Quem
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-xl text-base text-[#7D82A1]">
            O Ranked e para qualquer pessoa que queira transformar capacidades
            reais de IA em solucoes que resolvem problemas reais.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PERSONAS.map((persona) => (
            <motion.div
              key={persona.title}
              variants={scaleIn}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white p-6 text-center shadow-xl transition-all hover:shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0075FF]/10 text-[#0075FF]">
                <persona.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#002834]">
                {persona.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#7D82A1]">
                {persona.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing Section                                                     */
/* ------------------------------------------------------------------ */

function PricingSection() {
  return (
    <section id="precos" className="relative scroll-mt-20 py-20 font-poppins sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-[#002834] sm:text-4xl md:text-5xl"
          >
            Simples e acessivel
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-xl text-base text-[#7D82A1]">
            Comece gratis e evolua quando precisar.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2"
        >
          {/* Free plan */}
          <motion.div
            variants={scaleIn}
            className="rounded-3xl bg-white p-8 shadow-xl"
          >
            <div className="mb-6">
              <h3 className="mb-1 text-xl font-bold text-[#002834]">Gratis</h3>
              <p className="text-sm text-[#7D82A1]">Ideal para explorar a metodologia</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-[#002834]">R$ 0</span>
              <span className="text-[#7D82A1]">/mes</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "3 projetos ativos",
                "14 dias de trial com tudo",
                "Todas as 6 etapas",
                "40 exemplos de IA",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#7D82A1]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="leafbutton block border-2 border-[#0075FF]/20 px-6 py-3 text-center text-sm font-semibold text-[#0075FF] transition-all hover:border-[#0075FF] hover:bg-[#0075FF]/5"
            >
              Comecar gratis
            </Link>
          </motion.div>

          {/* Pro plan */}
          <motion.div
            variants={scaleIn}
            className="relative rounded-3xl border-2 border-[#0075FF] bg-white p-8 shadow-xl shadow-[#0075FF]/10"
          >
            <div className="absolute -top-3 right-6 rounded-full bg-[#0075FF] px-3 py-1 text-xs font-semibold text-white">
              Popular
            </div>
            <div className="mb-6">
              <h3 className="mb-1 text-xl font-bold text-[#002834]">PRO</h3>
              <p className="text-sm text-[#7D82A1]">Para times que levam inovacao a serio</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-[#002834]">R$ 29</span>
              <span className="text-[#7D82A1]">/mes</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Projetos ilimitados",
                "Export PDF",
                "Historico completo",
                "Todas as 6 etapas",
                "Suporte prioritario",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#7D82A1]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0075FF]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="leafbutton block bg-[#0075FF] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#0075FF]/25 transition-all hover:bg-[#0063d9] hover:shadow-xl hover:shadow-[#0075FF]/30"
            >
              Comecar gratis
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Newsletter / CTA Section                                            */
/* ------------------------------------------------------------------ */

function NewsletterSection() {
  return (
    <section className="relative py-20 font-poppins sm:py-28" style={{ backgroundColor: "#183B56" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Pronto para comecar?
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 text-base text-[#AEC7E4]">
            Comece gratis. Sem cartao de credito. Transforme suas ideias em
            produtos de IA com a metodologia da Carnegie Mellon University.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              placeholder="Seu melhor email"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-[#0075FF] focus:outline-none focus:ring-2 focus:ring-[#0075FF]/50 sm:max-w-sm"
            />
            <Link
              href="/login"
              className="leafbutton inline-flex w-full items-center justify-center gap-2 bg-[#0075FF] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0063d9] hover:shadow-lg hover:shadow-[#0075FF]/25 sm:w-auto"
            >
              Comecar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer (dSign dark style)                                           */
/* ------------------------------------------------------------------ */

function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="font-poppins" style={{ backgroundColor: "#000321" }}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0075FF]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Ranked
              </span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-[#AEC7E4]">
              Kanban de 6 etapas para idear produtos de IA. Baseado no AI Design
              Kit da Carnegie Mellon University.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="social-icon-hover flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#AEC7E4] transition-colors hover:bg-[#0075FF] hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Produto</h4>
            <ul className="space-y-3">
              <li>
                <a href="#como-funciona" className="text-sm text-[#AEC7E4] transition-colors hover:text-white">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#habilidades" className="text-sm text-[#AEC7E4] transition-colors hover:text-white">
                  Habilidades
                </a>
              </li>
              <li>
                <a href="#exemplos" className="text-sm text-[#AEC7E4] transition-colors hover:text-white">
                  Exemplos
                </a>
              </li>
              <li>
                <a href="#precos" className="text-sm text-[#AEC7E4] transition-colors hover:text-white">
                  Precos
                </a>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Recursos</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://doi.org/10.1145/3563657.3596058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#AEC7E4] transition-colors hover:text-white"
                >
                  Paper Original
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://aidesignkit.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#AEC7E4] transition-colors hover:text-white"
                >
                  AI Design Kit
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#AEC7E4]">
                <Mail className="h-4 w-4 text-[#90A3B4]" />
                contato@ranked.app
              </li>
              <li className="flex items-center gap-2 text-sm text-[#AEC7E4]">
                <MapPin className="h-4 w-4 text-[#90A3B4]" />
                Brasil
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-[#90A3B4]">
              Baseado no AI Design Kit — Carnegie Mellon University
            </p>
            <p className="text-xs text-[#90A3B4]">
              Traduzido por Leandro Rezende — UX Unicornio
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page: Landing                                                      */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-poppins" style={{ scrollBehavior: "smooth" }}>
      <Header />
      <GlowyWavesHero />
      <StatsSection />
      <SkillsSection />
      <ExamplesSection />
      <AbstractionSection />
      <HowItWorksSection />
      <PersonasSection />
      <PricingSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
