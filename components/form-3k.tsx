"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { KontikLogo } from "./kontik-logo"
import { SearchableSelect } from "./searchable-select"
import { FormField } from "./form-field"
import { SectionDivider } from "./section-divider"
import { CheckCircle2 } from "lucide-react"

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL ?? "https://YOUR_WEBHOOK_URL_HERE"

// ─── Option lists ──────────────────────────────────────────────────────────
const GRUPOS_EMPRESA = [
  "G4 Educação", "Grupo Abegas", "Grupo Acelen", "Grupo Aché", "Grupo Action Line",
  "Grupo Adidas", "Grupo ADM - Archer Daniels Midland Company", "Grupo Aeroleo",
  "Grupo AET TANKERS", "Grupo Agoro Carbon", "Grupo Airbus - Helibras", "Grupo Alares",
  "Grupo Alliança", "Grupo Amadeus", "Grupo Amcham Brasil", "Grupo Amway",
  "Grupo Arcadis", "Grupo Arezzo Varejo", "Grupo Argo", "Grupo Artesano Urbanismo",
  "Grupo Arxada", "Grupo Aspen Pharma", "Grupo Atento", "Grupo Atlas Copco",
  "Grupo Atos", "Grupo Avaya", "Grupo Avenida", "Grupo Axa", "Grupo Bahia Am Renda",
  "Grupo Bahia Mineração", "Grupo Baker McKenzie - Trench Rossi", "Grupo Banco Bbm",
  "Grupo Banco Caixa Geral Brasil", "Grupo Banco Genial", "Grupo Basf", "Grupo BAT",
  "Grupo Bernoulli Educação", "Grupo BHAirport", "Grupo Bioage", "Grupo Biolab",
  "Grupo Biomerieux", "Grupo Blu Pagamentos", "Grupo Bosch", "Grupo Braskem",
  "Grupo Bristow", "Grupo Brq It Services", "Grupo Camargo Correa", "Grupo Carmo Energy",
  "Grupo Carol Bassi", "Grupo Casas Bahia", "Grupo Case", "Grupo Cbo", "Grupo Chanel",
  "Grupo Cielo", "Grupo Claro Sa", "Grupo Cma", "Grupo Cmoc", "Grupo Cobra",
  "Grupo Comgas", "Grupo Conceba", "Grupo Concer", "Grupo Constellation",
  "Grupo Consulado Britanico", "Grupo Credibrf", "Grupo Credipronto", "Grupo Cvc Capital",
  "Grupo Cyncly", "Grupo Deloitte", "Grupo Diageo", "Grupo Eai – Grupo Ultra",
  "Grupo Ecp", "Grupo Efi", "Grupo Elanco", "Grupo Eletrobrás", "Grupo Elis Energia",
  "Grupo Enaex", "Grupo Energisa", "Grupo Enerpac", "Grupo Engelhart Ctp",
  "Grupo Epson", "Grupo Erb", "Grupo Estre Ambiental", "Grupo Extrafarma",
  "Grupo Falcon Active", "Grupo FCDO", "Grupo Fcm Global", "Grupo Ferreira Costa",
  "Grupo Firmenich", "Grupo First Solar", "Grupo Fm Global", "Grupo Fortlev",
  "Grupo Fraport", "Grupo Fs Bioenergia", "Grupo Garrett", "Grupo Gic", "Grupo Glory",
  "Grupo Greif", "Grupo Gtm", "Grupo HIAE - Hospital Albert Einstein", "Grupo Honeywell",
  "Grupo Hotel", "Grupo Hotelbeds", "Grupo HPE – Mitsubishi", "Grupo Htb",
  "Grupo Hypera", "Grupo Ibemapar", "Grupo Ihs", "Grupo Inframerica",
  "Grupo Innomotics", "Grupo Inovents", "Grupo Instituto Unibanco", "Grupo Intecom",
  "Grupo Intercement", "Grupo Invepar", "Grupo Ipiranga",
]

const SISTEMA_3K = [
  "3K", "Argo", "B2b", "Benner", "Concur", "Cytric",
  "Fora do Escopo", "Gover", "Infraestrutura", "Lemontech", "Paytrack", "Sabre",
]

const CATEGORIA_3K = [
  "Agradecimento", "Elogio", "Erro operacional", "Informação", "Reclamação",
]

const SUB_CATEGORIA = [
  "Agradecimento", "Elogio", "Erro operacional com custo", "Erro operacional sem custo",
  "Informações", "Reclamações", "Reclamações Indevida",
]

const TIPO_RECLAMACAO = [
  "Conciliação", "DNIT", "Faturamento", "FEE", "Fornecedor",
  "Operações", "Reembolso", "Relatorios/BI", "Suporte",
]

const MOTIVO_INSATISFACAO = [
  "Atendimento - Emergencial", "Atendimento - Koncept", "Atendimento - Operações",
  "Atraso Entrega Cartão", "Cancelamento Indevido", "Cobrança Incorreta",
  "Cobrança Incorreta - Cartão Aéreo", "Cobrança Incorreta - Cartão Terrestre",
  "Conciliação Aérea", "Conciliação não concluída", "Conciliação Terrestre",
  "Conduta Inadequada", "Demora no retorno", "Dificuldades na ferramenta - Suporte OBT",
  "Divergência - Relatório Gerencial", "Divergência nas Informações da Reserva",
  "Divergência Nota Fiscal", "Duplicidade de Emissão", "Entrega de cartão divergente",
  "Falha do Fornecedor", "Falha sistêmica - Gover", "Faturamento Divergente",
  "FEE", "Valores incorretos",
]

const DEPARTAMENTO_3K = [
  "Benner", "CX", "DNIT", "Emergencial", "Eventos", "Faturamento", "Financeiro",
  "GI", "KCS", "Koncept", "Kontik Club", "Kontrip", "Operações", "Produtos",
  "Reembolso", "Relacionamento", "TI", "Zupper",
]

const CONSULTORES = [
  "ADAILTON ALVES SANTOS FILHO", "ADRIANA DIAS DE GRANO", "ADRIANA MIRANDA COUTINHO",
  "ADRIANA VIEIRA DE FREITAS DOS SANTOS", "ADRIANO DE CARVALHO", "ADRIANO NAGAO SCHISSATTI",
  "ALEXANDRE DA CONCEIÇÃO ALVES", "ALEXANDRE FERNANDES FARIAS", "ALEXANDRE ISIDIO DA SILVA",
  "ALEXANDER PEREZ ALVES", "ALETEA BEATRIZ KUNZLER DE MOURA", "ALICA STHEFANY NUNES DOS SANTOS",
  "ALINE DOS ANJOS MARINHO", "ALINE GABRIELA CASARO", "ALINY RAFAELLA PEREIRA TOMAZ",
  "ANA CAROLINA DA SILVA", "ANA CLARA BRIME", "ANA CLARA SATURNINO LIMA",
  "ANA CRISTINA NETO DE ALMEIDA", "ANA PAULA COSTA FEITOSA", "ANDREA TIEMI SHINOHARA PAREJA",
  "ANDRE DE ARAUJO FRANCISCO", "ANDREIA DE ALENCAR ALVES", "ANDRESSA DE AGUILAR SENA SILVA",
  "ANDRESSA RIBEIRO COSSO", "ANGELA VITORIA CURRA", "BEATRYS FERREIRA ROCHA",
  "BIANCA BARBOSA DA SILVA", "BIANCA BARONTI MOCO", "BRUNA LOBO SIMOES DE LIMA OLIVEIRA",
  "BRUNA SEBBEN", "BRUNO ALVARENGA MELONI", "CAIO BETTIOL",
  "CAMILA MARTINES RUIS DE LIMA", "CAMILLA ALVES SILVA DE MELO", "CARLOS ANTONIO DURAN JUNIOR",
  "CARLOS HENRIQUE DA SILVA", "CAROLINA SOSA BENAVENTE", "CAROLINE ALBUQUERQUE COSTA ARAUJO",
  "CATIA LEITE OLIVEIRA", "CECILIA PAOLUCCI HERCULINO", "CELSO RODRIGUES CARDOSO",
  "CINTYA COCCO FIGUEIREDO", "CLAUDIA LUCIA STELLA", "CLAYTON ALVES DE REZENDE",
  "CORA TORLAI CIRINO", "CRISTIANE SANTOS PIO MEMORIA", "DAIANA CARNEIRO BARBOSA",
  "DANIEL GERMANO FERREIRA", "DANIELLY BRONIZIO LOPES", "DEISE FERNANDA FRANCA DE SOUZA",
  "DEIVID DA SILVA ORTOLAN", "DEMETRIUS PEPE MIGUEL", "DIOGO DANTAS GOMES",
  "DONIZETE ALVES DE SOUZA", "DYEGO DE JESUS BORGES", "EDIMEIA SANTANA DOS SANTOS",
  "EDUARDO VIEIRA GONCALVES MANSO", "EDUARDO VINICIUS SOUTO LONGO", "EDUARDA PEREIRA MATUTINO",
  "ELIANE DA SILVA SOUZA PAULA", "ELIDE PATRICIA ALTRAN", "ELIVANI SOUZA DE ARAUJO ANGI",
  "ELLEN DA CONCEICAO", "EMILIA ALEJANDRA PACHECO MARABOLI", "EMILY LUCENA MOTA DE MORAES",
  "ERCY IWAMOTO BRAZ", "ERNANI AFRANIO DOS SANTOS", "ETIANA CIDADE MORAES",
  "EVA SILVA FERREIRA", "FABIOLA LIMA DE OLIVEIRA", "FABIANE DE SOUZA MANTOVANI",
  "FELIPE ANDERSON DA SILVA", "FERNANDO AUGUSTO SANTIAGO DA SILVA", "FERNANDO LUIZ DA SILVA OLIVEIRA",
  "FLAVIA CONSTANZI DO NASCIMENTO", "FLAVIA LUQUES LAINO", "FLAVIO ROBERTO FERREIRA",
  "FRANCISCA MARIA MANGUEIRA", "GABRIEL ALVES MOURA", "GABRIEL ANDRADE MANZARO",
  "GABRIELA DUARTE LOPES", "GEOVANNE CONSTANZI PRUDENCIO", "GIOVANNA MARTHA SILVA POHLI",
  "GISELE OLIVEIRA SILVA", "GISELE SAGALA DENCK", "GISELE SOARES CARMO",
  "GUSTAVO SILVERIO DOMINGUES VIEIRA", "HERBERT AMANCIO DE SANTANA", "HUMBERTO DA FONTOURA",
  "ICARO GABRIEL PIMENTEL GOMES XAVIER", "INGRID VIANNA VARGAS DE OLIVEIRA",
  "INGRYD VITORIA DE SOUZA CORREIA DA SILVA", "ISABELA DE MELO DA SILVA", "ITAMAR DE SOUZA",
  "JACQUELINE DE SOUZA SANTOS", "JACKELINE CARVALHO PINTO NASCIMENTO", "JAKELINE DUARTE DA ROCHA",
  "JANAINA DOS SANTOS OLIVEIRA", "JEANE ALENCAR PEREIRA", "JENNIFER DOS SANTOS GUEDES DE OLIVEIRA",
  "JESSICA SOARES TEIXEIRA", "JOAO CARLOS DA CRUZ", "JOAO PAULO VILLAR SALES DE ARAUJO",
  "JOCELAINE SILVEIRA DEBOM", "JOEL BRENNO ALVES DE SOUZA", "JONAS BARBOSA DA COSTA",
  "JOSE ALEXANDRE SOARES CALDAS", "JOSE DE OLIVEIRA CUNHA", "JOSE LUIZ LACE RODRIGUES",
  "JOSIAS SOARES DE SOUZA", "JULIANA APARECIDA DE SOUZA SILVA", "JULIANA BUENO MELLO VAREJAO",
  "JULIANA DOS SANTOS PINTO", "KAREN APARECIDA FERREIRA", "KARLA DE ARAUJO BARBOSA",
  "KATE ALVES SANTOS", "LANA HARUMI TAKUMA", "LARISSA NUNES DOS SANTOS",
  "LEANDRA VITORIA GOMES SANTOS", "LETICIA JESUS VITAL", "LETICIA LEANDRO DA SILVA",
  "LETICIA LIMA ROSA", "LILA BEATRIZ DE MEDEIROS", "LILIA PEREIRA DIAS",
  "LOIZY LIMA DE OLIVEIRA", "LORRANY PEREIRA DE OLIVEIRA", "LUCAS DIAS DE SOUZA",
  "LUCENA MOTA DE MORAES (ver EMILY)", "LUCEZANGELA FERREIRA DE ARAUJO",
  "LUCIANA IGLESIAS DE SOUZA", "LUCIENE JESUS DOS SANTOS", "LUCY DE FREITAS PAES BRAZIL",
  "LUIZ CARLOS SILVA PINTO", "LUIZ HENRIQUE SASSI MASSAU", "MAICON SILVA DE MEDEIROS",
  "MARCELE LIMA MARTINS", "MARCELI APARECIDA CHARETTI", "MARCELINE DE LIMA MARTINS",
  "MARCELLO IGNACIO DE LIMA", "MARCELO DA SILVA", "MARCELO DE FREITAS",
  "MARCELO IGNACIO DE LIMA", "MARCELO NAOTO GUIMARAES MOREIRA", "MARCELO SOARES DE AZEVEDO",
  "MARCIA FERNANDES DE SOUSA", "MARCIA PEREIRA DOS SANTOS SOARES", "MARCIO JOSE DA SILVA",
  "MARIA CECILIA PEREIRA SILVA", "MARIA CLARA LANDEIRA MEZAVILA", "MARIA EDUARDA CAPITANI",
  "MARIA EDUARDA SIMOES ROSA", "MARIA EUGENIA OLIVA", "MARIA GABRIELA STELLA GOMES",
  "MARIA RAQUEL MONTEIRO MATHIAS", "MARIA VITORIA DA SILVA", "MARIANE GONCALVES DOS SANTOS",
  "MAURICIO ALMEIDA DE LIMA", "MAYARA DE OLIVEIRA ALENCAR", "MAYRA MARTINS ALVES",
  "MICHELI FERENZINI TORRES", "MICHELLY ANDRADE LEANDRO DA SILVA", "MYLENA MENDONCA SANTOS DA SILVA",
  "NAJLA NOGUEIRA VIEIRA", "NATALIA BARRAL DE OLIVEIRA", "NATALY FRANCA REGAL DE CASTRO",
  "NATHALIA DOS SANTOS BATISTA", "NATHALIA NAOMI WATANABE", "NICOLLY GABRIELLY FERNANDES DA SILVA",
  "PAMELA BRAGA DE MORAIS SILVA", "PATRICIA PINATO FERREIRA LIMA",
  "PATRICIA ROSIMAR BETTIM DE ALMEIDA", "PAULO ROBERTO MENDES DA SILVA",
  "POLIANA CARDOSO DA SILVA", "PRISCILLA ANDRADE SOBRINHO", "PRISCILLA CORTINES DE FREITAS",
  "RAFAEL DO NASCIMENTO ZIZZI", "RAFAEL LIMA DA SILVA", "RAFAEL LOSSURDO PONCE BRANDÃO",
  "RAFAELA LEITAO OLIVEIRA", "RAIANY DA PAZ VIDAL CORREIA DA SILVA", "RAISSA IORIO CESTARI",
  "RAQUEL RIBEIRO PINTO VILLARREAL", "RAUL ALVES VIEIRA", "RAYSSA MARTINS FERREIRA",
  "REBECA MENEZES CAMILO", "REGIANE LIMA BARBOSA", "REINILDO DAS VIRGENS SANTOS",
  "RENATA CLAUDIA DE OLIVEIRA", "RENATA GODOY SANT ANNA BOMFIM", "RENATA ROSENTHAL DOS SANTOS",
  "RENATO FERREIRA GOMES", "RENATO LOUREIRO BRANDAO", "ROBERTA IAQUIRI DA SILVA",
  "ROBERTO ANTUNES BENTO", "ROBSON ANTONIO MARQUES DE SOUZA", "RODRIGO BRITO",
  "ROGERIO AURY SCHAFFER", "RONALDO PEREIRA MUZEL", "RUBIA RIZZO MERITO DA SILVA",
  "SABRINA AMORIM BASTOS", "SAMANTHA SILVA DE OLIVEIRA", "SERGIO HENRIQUE MENDES",
  "SHARON STONE RODRIGUES MARQUES", "SHEILA RAMOS DOS SANTOS", "SIDNEI DE JESUS DIAS",
  "SIMONE MOREIRA DE BRITO", "TAIS DOS SANTOS DINIZ", "TAMI MARON",
  "TAMARA MICHELS BEHN", "TATIANE PRADELA ALVES DOS SANTOS", "THAIS PEIXOTO DE MELO",
  "THAISSA LAMARAO PAZ", "THAYNA LUIZA DE MORAES GOMES", "THIAGO ALBERTO MACHADO BATELLO",
  "TUANE CRISTINA ALVES DE OLIVEIRA", "VAGNER CHAGAS DOS ANJOS", "VALERIA APARECIDA CIVITATE",
  "VALERIA BOTTINO", "VALERIA DOMINGUES CAVALCANTE", "VANESSA ALVES DIAS",
  "VANESSA ARAUJO ALVES", "VANESSA DE MENDONÇA SANTOS",
  "VANESSA PEREIRA RIBEIRO CARLOS PIEPRZYK", "VANIA CARDOSO DA ROCHA",
  "VICTORIA ALEXANDRA MAGNO SANTOS", "VICTORIA LEITE POTZIK", "VINICIUS TADEU PIO SOARES",
  "VITORIA HELENA JACINTO LOPES SILVANO", "VITORIA SILVA LOPES", "VIVIAM MARIA DE SOUZA",
  "WAGNEY ARAUJO DE OLIVEIRA", "WAGNER PAULINO", "WELLINGTON RIBEIRO DA SILVA",
  "WELTON SILVA DA CUNHA", "WILLIAM DA CRUZ CANTEIRO",
  "WILSON JOSE ARAUJO DE GUSMAO JUNIOR", "WILSON LISBOA LIMA",
  "YURI BIZERRA RODRIGUES", "YURI JEDEAN SOUZA DA SILVA", "YURI MORIGUCHI ARAYA",
]

const EMPRESA_3K = [
  "Inovents", "Kontik Club", "Kontik RJ", "Kontik SP", "Kontik POA",
  "Kontrip", "Mercúrio", "Zupper",
]

const FILA_3K = [
  "Disponiveis 3k", "Em Tratativa Cliente", "Pesquisa",
  "Pendências", "Tratativa Interna", "Resolvido",
]

// ─── Types ─────────────────────────────────────────────────────────────────
interface FormState {
  grupoEmpresa: string
  sistema3k: string
  categoria3k: string
  subCategoria: string
  tipoReclamacao: string
  validadoTrilha: boolean
  motivoInsatisfacao: string
  rloc: string
  departamento3k: string
  consultor: string
  empresa3k: string
  fila3k: string
}

interface FormErrors {
  grupoEmpresa?: string
  subCategoria?: string
}

const INITIAL_STATE: FormState = {
  grupoEmpresa: "",
  sistema3k: "",
  categoria3k: "",
  subCategoria: "",
  tipoReclamacao: "",
  validadoTrilha: false,
  motivoInsatisfacao: "",
  rloc: "",
  departamento3k: "",
  consultor: "",
  empresa3k: "",
  fila3k: "",
}

// ─── Shared input styles ───────────────────────────────────────────────────
const inputBase =
  "w-full px-3 py-2.5 text-sm rounded-[6px] border border-[#404653] bg-white text-[#404653] outline-none transition-all focus:ring-2 focus:ring-offset-0 focus:ring-[#C2D82F]/50 focus:border-[#C2D82F] placeholder:text-[#9aa0ad]"
const inputError = "border-red-500 focus:ring-red-200"

function NativeSelect({
  options,
  value,
  onChange,
  id,
  error,
  required,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  id?: string
  error?: string
  required?: boolean
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          inputBase,
          "appearance-none pr-9 cursor-pointer",
          !value && "text-[#9aa0ad]",
          error && inputError
        )}
        style={{ color: value ? "#404653" : undefined }}
      >
        <option value="" disabled>Selecione...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#404653" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function Form3K() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.grupoEmpresa) e.grupoEmpresa = "Campo obrigatório"
    if (!form.subCategoria) e.subCategoria = "Campo obrigatório"
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError("")

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErrorEl =
        errs.grupoEmpresa
          ? document.getElementById("grupoEmpresa")
          : document.getElementById("subCategoria")
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        grupo_empresa: form.grupoEmpresa,
        sistema_3k: form.sistema3k,
        categoria_3k: form.categoria3k,
        sub_categoria: form.subCategoria,
        tipo_reclamacao: form.tipoReclamacao,
        validado_trilha_excelencia: form.validadoTrilha,
        motivo_insatisfacao: form.motivoInsatisfacao,
        rloc: form.rloc,
        departamento_3k: form.departamento3k,
        consultor: form.consultor,
        empresa_3k: form.empresa3k,
        fila_3k: form.fila3k,
      }

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSuccess(true)
      setForm(INITIAL_STATE)
    } catch {
      setSubmitError("Erro ao enviar formulário. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f4f5f3" }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-md w-full">
          <CheckCircle2 size={52} className="mx-auto mb-4" style={{ color: "#C2D82F" }} />
          <p className="text-lg font-semibold" style={{ color: "#404653" }}>
            Formulário enviado com sucesso!
          </p>
          <p className="text-sm mt-2" style={{ color: "#9aa0ad" }}>
            O registro foi salvo com sucesso.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 text-sm font-medium underline"
            style={{ color: "#404653" }}
          >
            Preencher novo formulário
          </button>
        </div>
      </div>
    )
  }

  return (
    <main
      className="min-h-screen py-10 px-4 font-sans"
      style={{ background: "#f4f5f3" }}
    >
      <div className="mx-auto w-full max-w-[720px]">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header bar */}
          <div className="h-1.5 w-full" style={{ background: "#C2D82F" }} />

          <div className="px-8 pt-8 pb-10 sm:px-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <KontikLogo />
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1
                className="text-xl font-bold tracking-tight text-balance"
                style={{ color: "#404653" }}
              >
                Formulário 3K
              </h1>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#9aa0ad" }}>
                Preencha todos os campos obrigatórios antes de finalizar
              </p>
              <p className="text-xs mt-2" style={{ color: "#9aa0ad" }}>
                Campos marcados com{" "}
                <span style={{ color: "#E31F26" }}>*</span> são obrigatórios
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* ── Seção: Empresa ────────────────────────────────────────── */}
              <SectionDivider title="Empresa" />

              {/* 1. Grupo Empresa */}
              <FormField
                label="Grupo Empresa"
                required
                error={errors.grupoEmpresa}
                htmlFor="grupoEmpresa"
              >
                <SearchableSelect
                  id="grupoEmpresa"
                  options={GRUPOS_EMPRESA}
                  value={form.grupoEmpresa}
                  onChange={(v) => set("grupoEmpresa", v)}
                  error={errors.grupoEmpresa}
                  required
                />
              </FormField>

              {/* 2. Sistema 3K */}
              <FormField label="Sistema 3K" htmlFor="sistema3k">
                <NativeSelect
                  id="sistema3k"
                  options={SISTEMA_3K}
                  value={form.sistema3k}
                  onChange={(v) => set("sistema3k", v)}
                />
              </FormField>

              {/* 11. Empresa 3K */}
              <FormField label="Empresa 3K" htmlFor="empresa3k">
                <NativeSelect
                  id="empresa3k"
                  options={EMPRESA_3K}
                  value={form.empresa3k}
                  onChange={(v) => set("empresa3k", v)}
                />
              </FormField>

              {/* ── Seção: Categorização ──────────────────────────────────── */}
              <SectionDivider title="Categorização" />

              {/* 3. Categoria - 3k */}
              <FormField label="Categoria - 3k" htmlFor="categoria3k">
                <NativeSelect
                  id="categoria3k"
                  options={CATEGORIA_3K}
                  value={form.categoria3k}
                  onChange={(v) => set("categoria3k", v)}
                />
              </FormField>

              {/* 4. Sub Categoria */}
              <FormField
                label="Sub Categoria"
                required
                error={errors.subCategoria}
                htmlFor="subCategoria"
              >
                <NativeSelect
                  id="subCategoria"
                  options={SUB_CATEGORIA}
                  value={form.subCategoria}
                  onChange={(v) => set("subCategoria", v)}
                  error={errors.subCategoria}
                  required
                />
              </FormField>

              {/* 5. Tipo da Reclamação */}
              <FormField label="Tipo da Reclamação" htmlFor="tipoReclamacao">
                <NativeSelect
                  id="tipoReclamacao"
                  options={TIPO_RECLAMACAO}
                  value={form.tipoReclamacao}
                  onChange={(v) => set("tipoReclamacao", v)}
                />
              </FormField>

              {/* 7. Motivo da insatisfação */}
              <FormField label="Motivo da insatisfação" htmlFor="motivoInsatisfacao">
                <SearchableSelect
                  id="motivoInsatisfacao"
                  options={MOTIVO_INSATISFACAO}
                  value={form.motivoInsatisfacao}
                  onChange={(v) => set("motivoInsatisfacao", v)}
                />
              </FormField>

              {/* ── Seção: Dados Adicionais ───────────────────────────────── */}
              <SectionDivider title="Dados Adicionais" />

              {/* 6. Validado Trilha da Excelência */}
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="validadoTrilha"
                    checked={form.validadoTrilha}
                    onChange={(e) => set("validadoTrilha", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#404653] cursor-pointer accent-[#C2D82F]"
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#404653" }}>
                    Validado Trilha da Excelência
                  </span>
                </label>
              </div>

              {/* 8. Rloc */}
              <FormField label="Rloc" htmlFor="rloc">
                <input
                  id="rloc"
                  type="text"
                  value={form.rloc}
                  onChange={(e) => set("rloc", e.target.value)}
                  placeholder="Digite o Rloc..."
                  className={inputBase}
                />
              </FormField>

              {/* 9. Departamento - 3K */}
              <FormField label="Departamento - 3K" htmlFor="departamento3k">
                <NativeSelect
                  id="departamento3k"
                  options={DEPARTAMENTO_3K}
                  value={form.departamento3k}
                  onChange={(v) => set("departamento3k", v)}
                />
              </FormField>

              {/* 10. Consultor */}
              <FormField label="Consultor" htmlFor="consultor">
                <SearchableSelect
                  id="consultor"
                  options={CONSULTORES}
                  value={form.consultor}
                  onChange={(v) => set("consultor", v)}
                />
              </FormField>

              {/* 12. Fila 3k */}
              <FormField label="Fila 3k" htmlFor="fila3k">
                <NativeSelect
                  id="fila3k"
                  options={FILA_3K}
                  value={form.fila3k}
                  onChange={(v) => set("fila3k", v)}
                />
              </FormField>

              {/* ── Submit error ──────────────────────────────────────────── */}
              {submitError && (
                <p
                  className="text-sm font-medium text-center py-2 px-3 rounded-[6px] bg-red-50"
                  style={{ color: "#E31F26" }}
                  role="alert"
                >
                  {submitError}
                </p>
              )}

              {/* ── Submit button ─────────────────────────────────────────── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "w-full py-3 rounded-[6px] text-sm font-semibold tracking-wide transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2D82F]",
                    submitting
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:brightness-95 active:scale-[0.99]"
                  )}
                  style={{
                    background: "#C2D82F",
                    color: "#404653",
                  }}
                >
                  {submitting ? "Enviando..." : "Enviar Formulário"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-5" style={{ color: "#b0b5be" }}>
          © {new Date().getFullYear()} Kontik Business Travel. Todos os direitos reservados.
        </p>
      </div>
    </main>
  )
}
