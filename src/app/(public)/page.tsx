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
} from "lucide-react";
import { GlowyWavesHero } from "@/components/ui/glowy-waves-hero";

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

const STEPS = [
  {
    num: 1,
    icon: FileText,
    title: "Definir Projeto",
    desc: "Defina dominio, usuario-alvo e problemas reais. O contexto aparece fixo durante todo o fluxo.",
    color: "from-violet-500 to-purple-600",
  },
  {
    num: 2,
    icon: Brain,
    title: "Estudar Habilidades de IA",
    desc: "10 cards de habilidades: Detectar, Identificar, Estimar, Prever, Comparar, Descobrir, Gerar, Agir. Marque as que voce entendeu.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    num: 3,
    icon: LayoutGrid,
    title: "Navegar 40 Exemplos",
    desc: "Galeria de 40 exemplos reais de IA em 14 dominios. Filtre por dominio e por habilidade. Descubra analogias inesperadas.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    num: 4,
    icon: GitBranch,
    title: "Niveis de Abstracao",
    desc: "Visualize como capabilities especificas se abstraem em padroes reutilizaveis entre dominios diferentes.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    num: 5,
    icon: Layers,
    title: "Montar o Deck",
    desc: "Selecione 10-15 exemplos para seu deck de inspiracao. Um indicador mostra a cobertura das 10 habilidades.",
    color: "from-cyan-500 to-teal-600",
  },
  {
    num: 6,
    icon: Lightbulb,
    title: "Gerar Ideias",
    desc: "Board de post-its para criar conceitos. Combine problema + deck + habilidades de IA. Vote com joinha para priorizar.",
    color: "from-teal-500 to-emerald-600",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Catalogo de 10 Habilidades de IA",
    desc: "Detectar, Identificar, Estimar, Prever, Comparar, Descobrir, Gerar, Agir, Monitorar, Recomendar — com definicoes, sinonimos e exemplos praticos.",
  },
  {
    icon: LayoutGrid,
    title: "40 Exemplos em 14 Dominios",
    desc: "De monitoramento de vida selvagem a chatbots de RH. Cada exemplo detalha quais capacidades de IA utiliza.",
  },
  {
    icon: Filter,
    title: "Filtros Inteligentes",
    desc: "Filtre exemplos por dominio ou por habilidade. Clique em uma capability para ver todos os exemplos que a compartilham.",
  },
  {
    icon: PieChart,
    title: "Indicador de Cobertura",
    desc: "Ao montar seu deck, veja quais das 10 habilidades estao cobertas e quais faltam — como um checklist visual.",
  },
  {
    icon: ThumbsUp,
    title: "Board de Ideias com Votacao",
    desc: "Crie conceitos como post-its. Cada ideia descreve quais habilidades de IA usaria. Vote com joinha para priorizar.",
  },
  {
    icon: BookOpen,
    title: "Baseado em Pesquisa Academica",
    desc: "Metodologia do paper 'Creating Design Resources to Scaffold the Ideation of AI Concepts' (DIS 2023, CMU).",
  },
];

const PERSONAS = [
  {
    icon: Trophy,
    title: "Product Managers",
    desc: "Priorize features de IA com base em capacidades reais, nao em hype.",
  },
  {
    icon: Palette,
    title: "UX Designers",
    desc: "Entenda o que a IA pode fazer antes de desenhar interfaces.",
  },
  {
    icon: GraduationCap,
    title: "Professores e Facilitadores",
    desc: "Guie workshops de ideacao de IA com uma metodologia validada.",
  },
  {
    icon: Rocket,
    title: "Times de Inovacao",
    desc: "Saia da reuniao com conceitos priorizados e fundamentados.",
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
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
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-card/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Ranked
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#como-funciona"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Como funciona
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Precos
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            Comecar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Hero                                                      */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Baseado no AI Design Kit — Carnegie Mellon University
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Transforme ideias em{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              produtos de IA
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            O Kanban de 6 etapas baseado na pesquisa do AI Design Kit da Carnegie
            Mellon University que guia voce da ideia ao conceito de produto.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Comecar agora — e gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#como-funciona"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              Ver como funciona
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Visual: 6 Kanban stages */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } } }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((step) => (
              <motion.div
                key={step.num}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
                }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${step.color} text-white shadow-sm`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="mb-1 text-xs font-semibold text-primary/60">
                  Etapa {step.num}
                </div>
                <div className="text-sm font-semibold text-foreground leading-tight">
                  {step.title}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connecting line under the cards */}
          <div className="mt-4 hidden items-center justify-center lg:flex">
            <div className="h-0.5 w-full max-w-4xl rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 opacity-30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Problem                                                   */
/* ------------------------------------------------------------------ */

function ProblemSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-12"
          >
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-alert">85%</span> dos projetos de IA{" "}
              <span className="text-alert">falham</span> antes do deploy
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Times escolhem os problemas errados para resolver. Falta um processo
              estruturado que combine necessidades do usuario com capacidades reais
              de IA.
            </p>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-3"
          >
            {[
              { stat: "85%", label: "dos projetos de IA falham", accent: "text-alert" },
              { stat: "70%", label: "nao passam do piloto", accent: "text-accent" },
              { stat: "6 etapas", label: "para mudar essa realidade", accent: "text-primary" },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={scaleIn}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className={`mb-2 text-3xl font-extrabold ${item.accent}`}>
                  {item.stat}
                </div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-xs text-muted-foreground/70"
          >
            Pesquisa do Human-Computer Interaction Institute — Carnegie Mellon
            University
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Como Funciona (6 Steps)                                   */
/* ------------------------------------------------------------------ */

function StepsSection() {
  return (
    <section id="como-funciona" className="relative scroll-mt-20 py-20 sm:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            Metodologia validada
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            6 etapas do problema a ideia validada
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Cada etapa foi desenhada para expandir seu repertorio sobre IA e gerar
            conceitos fundamentados.
          </motion.p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
              }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg"
            >
              {/* Step number background */}
              <div className="pointer-events-none absolute -right-4 -top-4 text-[80px] font-extrabold leading-none text-primary/[0.04]">
                {step.num}
              </div>

              <div className="relative">
                {/* Icon & number */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {step.num}
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Features                                                  */
/* ------------------------------------------------------------------ */

function FeaturesSection() {
  return (
    <section id="features" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-muted/30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <Star className="h-4 w-4" />
            Features
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Tudo que voce precisa para idear com IA
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-base font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Para Quem                                                 */
/* ------------------------------------------------------------------ */

function PersonasSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
            <Users className="h-4 w-4" />
            Publico
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Para quem e o Ranked?
          </motion.h2>
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
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/20 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-all group-hover:from-primary group-hover:to-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                <persona.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-base font-bold text-foreground">
                {persona.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
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
/*  Section: Pricing                                                   */
/* ------------------------------------------------------------------ */

function PricingSection() {
  return (
    <section id="pricing" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Simples e acessivel
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-muted-foreground">
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
            className="rounded-2xl border border-border bg-card p-8 shadow-sm"
          >
            <div className="mb-6">
              <h3 className="mb-1 text-xl font-bold text-foreground">Gratis</h3>
              <p className="text-sm text-muted-foreground">Ideal para explorar a metodologia</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">R$ 0</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "3 projetos ativos",
                "14 dias de trial com tudo",
                "Todas as 6 etapas",
                "40 exemplos de IA",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="block rounded-xl border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              Comecar gratis
            </Link>
          </motion.div>

          {/* Pro plan */}
          <motion.div
            variants={scaleIn}
            className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-lg shadow-primary/10"
          >
            <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Popular
            </div>
            <div className="mb-6">
              <h3 className="mb-1 text-xl font-bold text-foreground">PRO</h3>
              <p className="text-sm text-muted-foreground">Para times que levam inovacao a serio</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">R$ 29</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Projetos ilimitados",
                "Export PDF",
                "Historico completo",
                "Todas as 6 etapas",
                "Suporte prioritario",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="block rounded-xl bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
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
/*  Section: CTA Final                                                 */
/* ------------------------------------------------------------------ */

function FinalCTASection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Pronto para transformar ideias em produtos de IA?
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 text-lg text-muted-foreground">
            Comece gratis. Sem cartao de credito.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Comecar agora — e gratis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Footer                                                    */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Ranked
              </span>
            </div>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Kanban de 6 etapas para idear produtos de IA. Baseado no AI Design
              Kit da Carnegie Mellon University.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Traduzido e adaptado por Leandro Rezende — UX Unicornio
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://doi.org/10.1145/3563657.3596058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  AI Design Kit
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Produto</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#como-funciona"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Precos
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground/70">
          Baseado no AI Design Kit da Carnegie Mellon University
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
    <div className="min-h-screen bg-background" style={{ scrollBehavior: "smooth" }}>
      <Header />
      <GlowyWavesHero />
      <ProblemSection />
      <StepsSection />
      <FeaturesSection />
      <PersonasSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
