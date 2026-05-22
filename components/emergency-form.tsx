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
const ATENDENTES = ["Herbert Santana", "Flávio Mazzola", "Samantha Oliveira", "Não se aplica"]

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

const SOLICITACAO_EMERGENCIAL = ["On-line", "Off-line"]
const SOLICITACOES = ["Internacional", "Nacional"]
const FORNECEDOR = ["Aéreo", "Carro", "Hotel", "Rodoviário", "Seguro Viagem", "Transfer"]
const CANAL = ["E-mail", "Telefone", "OBT", "WhatsApp"]
const SERVICO = [
  "Alteração", "Cancelamento", "Cotação", "Direcionado ao Posto", "Emissão",
  "Fora do Escopo – Atendido", "Informações", "Ligação", "Reenvio",
  "Regularização de Pagamento", "Reserva", "Suporte Interno", "Transfer",
]
const LOCAL_RESERVA = ["B2B", "Best Buy", "Direto no hotel", "EHTL", "Omnibees", "Outros", "Sabre", "Trend"]
const JUSTIFICATIVA = [
  "Solicitação não tratada em horário comercial", "Solicitação Emergencial",
  "Erro do Sistema", "Solicitação Depto Comercial", "Suporte Interno",
]
const FILA = [
  "Atualizados - Fora do horário", "Claro", "Confirmações", "Em Tratativa",
  "Falha de Emissão", "Fora do Horário", "Monitoramento",
  "Pendência de Contabilização", "Pendências",
]

// ─── Types ─────────────────────────────────────────────────────────────────
interface Passageiro {
  sobrenomeNome: string
  localizador: string
  matricula: string
  centroCusto: string
  observacoes: string
}

interface FormState {
  atendente: string
  grupoEmpresa: string
  cnpjEmpresa: string
  solicitacaoEmergencial: string
  solicitacoes: string
  passageiros: Passageiro[]
  fornecedor: string
  canal: string
  servico: string
  localReserva: string
  justificativa: string
  filaAtendimento: string
  emergencialCopia: boolean
  emailEnviado: boolean
}

interface PassageiroErrors {
  sobrenomeNome?: string
  localizador?: string
  matricula?: string
  centroCusto?: string
}

interface FormErrors {
  atendente?: string
  grupoEmpresa?: string
  solicitacoes?: string
  passageiros?: PassageiroErrors[]
  fornecedor?: string
  servico?: string
  localReserva?: string
  justificativa?: string
}

const createEmptyPassageiro = (): Passageiro => ({
  sobrenomeNome: "",
  localizador: "",
  matricula: "",
  centroCusto: "",
  observacoes: "",
})

// ─── CNPJ mask ─────────────────────────────────────────────────────────────
function maskCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

const INITIAL_STATE: FormState = {
  atendente: "",
  grupoEmpresa: "",
  cnpjEmpresa: "",
  solicitacaoEmergencial: "",
  solicitacoes: "",
  passageiros: [createEmptyPassageiro()],
  fornecedor: "",
  canal: "",
  servico: "",
  localReserva: "",
  justificativa: "",
  filaAtendimento: "",
  emergencialCopia: false,
  emailEnviado: false,
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
export function EmergencyForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [qtdPassageiros, setQtdPassageiros] = useState(1)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function handleGrupoEmpresaChange(v: string) {
    setForm((prev) => ({
      ...prev,
      grupoEmpresa: v,
      // Clear CNPJ when the user deselects the group
      cnpjEmpresa: v ? prev.cnpjEmpresa : "",
    }))
    setErrors((prev) => ({ ...prev, grupoEmpresa: undefined }))
  }

  function setPassageiro(index: number, field: keyof Passageiro, value: string) {
    setForm((prev) => {
      const newPassageiros = [...prev.passageiros]
      newPassageiros[index] = { ...newPassageiros[index], [field]: value }
      return { ...prev, passageiros: newPassageiros }
    })
    // Clear error for this specific passenger field
    if (errors.passageiros?.[index]?.[field as keyof PassageiroErrors]) {
      setErrors((prev) => {
        const newPassageiroErrors = [...(prev.passageiros || [])]
        if (newPassageiroErrors[index]) {
          newPassageiroErrors[index] = { ...newPassageiroErrors[index], [field]: undefined }
        }
        return { ...prev, passageiros: newPassageiroErrors }
      })
    }
  }

  function handleQtdChange(newQtd: number) {
    const clampedQtd = Math.max(1, Math.min(40, newQtd))
    setQtdPassageiros(clampedQtd)
    
    setForm((prev) => {
      const currentPassageiros = prev.passageiros
      if (clampedQtd > currentPassageiros.length) {
        // Add new empty passengers
        const toAdd = clampedQtd - currentPassageiros.length
        const newPassageiros = [...currentPassageiros]
        for (let i = 0; i < toAdd; i++) {
          newPassageiros.push(createEmptyPassageiro())
        }
        return { ...prev, passageiros: newPassageiros }
      } else if (clampedQtd < currentPassageiros.length) {
        // Remove passengers from the end
        return { ...prev, passageiros: currentPassageiros.slice(0, clampedQtd) }
      }
      return prev
    })
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.atendente) e.atendente = "Campo obrigatório"
    if (!form.grupoEmpresa) e.grupoEmpresa = "Campo obrigatório"
    if (!form.solicitacoes) e.solicitacoes = "Campo obrigatório"
    
    // Validate each passenger
    const passageiroErrors: PassageiroErrors[] = []
    let hasPassageiroError = false
    form.passageiros.forEach((p, i) => {
      const pErr: PassageiroErrors = {}
      if (!p.sobrenomeNome.trim()) { pErr.sobrenomeNome = "Campo obrigatório"; hasPassageiroError = true }
      if (!p.localizador.trim()) { pErr.localizador = "Campo obrigatório"; hasPassageiroError = true }
      if (!p.matricula.trim()) { pErr.matricula = "Campo obrigatório"; hasPassageiroError = true }
      if (!p.centroCusto.trim()) { pErr.centroCusto = "Campo obrigatório"; hasPassageiroError = true }
      passageiroErrors[i] = pErr
    })
    if (hasPassageiroError) e.passageiros = passageiroErrors
    
    if (!form.fornecedor) e.fornecedor = "Campo obrigatório"
    if (!form.servico) e.servico = "Campo obrigatório"
    if (!form.localReserva) e.localReserva = "Campo obrigatório"
    if (!form.justificativa) e.justificativa = "Campo obrigatório"
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError("")

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // scroll to first error
      let firstErrorEl: HTMLElement | null = null
      if (errs.atendente) firstErrorEl = document.getElementById("atendente")
      else if (errs.grupoEmpresa) firstErrorEl = document.getElementById("grupoEmpresa")
      else if (errs.solicitacoes) firstErrorEl = document.getElementById("solicitacoes")
      else if (errs.passageiros) {
        // Find first passenger with error
        for (let i = 0; i < errs.passageiros.length; i++) {
          const pErr = errs.passageiros[i]
          if (pErr?.sobrenomeNome) { firstErrorEl = document.getElementById(`sobrenomeNome-${i}`); break }
          if (pErr?.localizador) { firstErrorEl = document.getElementById(`localizador-${i}`); break }
          if (pErr?.matricula) { firstErrorEl = document.getElementById(`matricula-${i}`); break }
          if (pErr?.centroCusto) { firstErrorEl = document.getElementById(`centroCusto-${i}`); break }
        }
      }
      else if (errs.fornecedor) firstErrorEl = document.getElementById("fornecedor")
      else if (errs.servico) firstErrorEl = document.getElementById("servico")
      else if (errs.localReserva) firstErrorEl = document.getElementById("localReserva")
      else if (errs.justificativa) firstErrorEl = document.getElementById("justificativa")
      
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        atendente_extra: form.atendente,
        grupo_empresa: form.grupoEmpresa,
        cnpj_empresa: form.cnpjEmpresa.trim() || "Não cadastrado",
        solicitacao_emergencial: form.solicitacaoEmergencial,
        solicitacoes: form.solicitacoes,
        passageiros: form.passageiros.map((p) => ({
          nome: p.sobrenomeNome,
          localizador: p.localizador,
          matricula: p.matricula,
          centro_de_custo: p.centroCusto,
          observacoes: p.observacoes,
        })),
        fornecedor_emergencial: form.fornecedor,
        canal_de_atendimento: form.canal,
        servico_emergencial: form.servico,
        local_de_reserva_emergencial: form.localReserva,
        justificativa_emergencial: form.justificativa,
        fila_de_atendimento_emergencial: form.filaAtendimento,
        emergencial_estava_em_copia: form.emergencialCopia,
        email_enviado_ao_emergencial: form.emailEnviado,
      }

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSuccess(true)
      setForm(INITIAL_STATE)
      setQtdPassageiros(1)
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
            O atendimento emergencial foi registrado.
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
                Formulário de Atendimento Emergencial
              </h1>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#9aa0ad" }}>
                Preencha todos os campos obrigatórios antes de finalizar o atendimento
              </p>
              <p className="text-xs mt-2" style={{ color: "#9aa0ad" }}>
                Campos marcados com{" "}
                <span style={{ color: "#E31F26" }}>*</span> são obrigatórios
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* ── Seção: Equipe ─────────────────────────────────────────── */}
              <SectionDivider title="Equipe e Empresa" />

              {/* 1. Atendente Extra */}
              <FormField
                label="Atendente Extra"
                required
                error={errors.atendente}
                htmlFor="atendente"
              >
                <NativeSelect
                  id="atendente"
                  options={ATENDENTES}
                  value={form.atendente}
                  onChange={(v) => set("atendente", v)}
                  error={errors.atendente}
                  required
                />
              </FormField>

              {/* 2. Grupo Empresa */}
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
                  onChange={handleGrupoEmpresaChange}
                  error={errors.grupoEmpresa}
                  required
                />
              </FormField>

              {/* 2b. CNPJ da Empresa — exibido apenas quando um grupo está selecionado */}
              {form.grupoEmpresa && (
                <FormField
                  label="CNPJ da Empresa"
                  htmlFor="cnpjEmpresa"
                >
                  <input
                    id="cnpjEmpresa"
                    type="text"
                    inputMode="numeric"
                    value={form.cnpjEmpresa}
                    onChange={(e) => set("cnpjEmpresa", maskCNPJ(e.target.value))}
                    placeholder="Ex: 00.000.000/0001-00"
                    maxLength={18}
                    className={inputBase}
                  />
                </FormField>
              )}

              {/* ── Seção: Solicitação ────────────────────────────────────── */}
              <SectionDivider title="Dados da Solicitação" />

              {/* 3. Solicitação Emergencial */}
              <FormField
                label="Solicitação Emergencial"
                htmlFor="solicitacaoEmergencial"
              >
                <NativeSelect
                  id="solicitacaoEmergencial"
                  options={SOLICITACAO_EMERGENCIAL}
                  value={form.solicitacaoEmergencial}
                  onChange={(v) => set("solicitacaoEmergencial", v)}
                />
              </FormField>

              {/* 4. Solicitações */}
              <FormField
                label="Solicitações (nacional e internacional)"
                required
                error={errors.solicitacoes}
                htmlFor="solicitacoes"
              >
                <NativeSelect
                  id="solicitacoes"
                  options={SOLICITACOES}
                  value={form.solicitacoes}
                  onChange={(v) => set("solicitacoes", v)}
                  error={errors.solicitacoes}
                  required
                />
              </FormField>

              {/* ── Seção: Passageiro ─────────────────────────────────────── */}
              <SectionDivider title="Dados do Passageiro" />

              {/* Quantidade de Passageiros */}
              <FormField
                label="Quantidade de Passageiros"
                htmlFor="qtdPassageiros"
              >
                <input
                  id="qtdPassageiros"
                  type="number"
                  min={1}
                  max={40}
                  value={qtdPassageiros}
                  onChange={(e) => handleQtdChange(parseInt(e.target.value) || 1)}
                  className={cn(inputBase, "w-32")}
                />
              </FormField>

              {/* Dynamic Passenger Groups */}
              {form.passageiros.map((passageiro, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4"
                  style={{ background: "#fafafa" }}
                >
                  <h3 className="text-sm font-semibold" style={{ color: "#404653" }}>
                    Passageiro {index + 1}
                  </h3>

                  {/* Sobrenome/Nome Passageiro */}
                  <FormField
                    label="Sobrenome/Nome Passageiro"
                    required
                    error={errors.passageiros?.[index]?.sobrenomeNome}
                    htmlFor={`sobrenomeNome-${index}`}
                  >
                    <input
                      id={`sobrenomeNome-${index}`}
                      type="text"
                      value={passageiro.sobrenomeNome}
                      onChange={(e) => setPassageiro(index, "sobrenomeNome", e.target.value)}
                      placeholder="Ex: Silva / João"
                      required
                      className={cn(inputBase, errors.passageiros?.[index]?.sobrenomeNome && inputError)}
                    />
                  </FormField>

                  {/* Localizador & Matrícula — Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Localizador"
                      required
                      error={errors.passageiros?.[index]?.localizador}
                      htmlFor={`localizador-${index}`}
                    >
                      <input
                        id={`localizador-${index}`}
                        type="text"
                        value={passageiro.localizador}
                        onChange={(e) => setPassageiro(index, "localizador", e.target.value)}
                        placeholder="Ex: ABC123"
                        required
                        className={cn(inputBase, errors.passageiros?.[index]?.localizador && inputError)}
                      />
                    </FormField>

                    <FormField
                      label="Matrícula"
                      required
                      error={errors.passageiros?.[index]?.matricula}
                      htmlFor={`matricula-${index}`}
                    >
                      <input
                        id={`matricula-${index}`}
                        type="text"
                        value={passageiro.matricula}
                        onChange={(e) => setPassageiro(index, "matricula", e.target.value)}
                        placeholder="Ex: 00123"
                        required
                        className={cn(inputBase, errors.passageiros?.[index]?.matricula && inputError)}
                      />
                    </FormField>
                  </div>

                  {/* Centro de Custo */}
                  <FormField
                    label="Centro de Custo"
                    required
                    error={errors.passageiros?.[index]?.centroCusto}
                    htmlFor={`centroCusto-${index}`}
                  >
                    <input
                      id={`centroCusto-${index}`}
                      type="text"
                      value={passageiro.centroCusto}
                      onChange={(e) => setPassageiro(index, "centroCusto", e.target.value)}
                      placeholder="Ex: CC-0042"
                      required
                      className={cn(inputBase, errors.passageiros?.[index]?.centroCusto && inputError)}
                    />
                  </FormField>

                  {/* Observações */}
                  <FormField label="Observações" htmlFor={`observacoes-${index}`}>
                    <textarea
                      id={`observacoes-${index}`}
                      rows={2}
                      value={passageiro.observacoes}
                      onChange={(e) => setPassageiro(index, "observacoes", e.target.value)}
                      placeholder="Informações adicionais..."
                      className={cn(inputBase, "resize-none")}
                    />
                  </FormField>
                </div>
              ))}

              {/* ── Seção: Emergencial ────────────────────────────────────── */}
              <SectionDivider title="Dados Emergenciais" />

              {/* 10. Fornecedor */}
              <FormField
                label="Fornecedor - Emergencial"
                required
                error={errors.fornecedor}
                htmlFor="fornecedor"
              >
                <NativeSelect
                  id="fornecedor"
                  options={FORNECEDOR}
                  value={form.fornecedor}
                  onChange={(v) => set("fornecedor", v)}
                  error={errors.fornecedor}
                  required
                />
              </FormField>

              {/* 11 & 12 — Two columns on wider screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 11. Canal de Atendimento */}
                <FormField
                  label="Canal de Atendimento"
                  htmlFor="canal"
                >
                  <NativeSelect
                    id="canal"
                    options={CANAL}
                    value={form.canal}
                    onChange={(v) => set("canal", v)}
                  />
                </FormField>

                {/* 12. Serviço - Emergencial */}
                <FormField
                  label="Serviço - Emergencial"
                  required
                  error={errors.servico}
                  htmlFor="servico"
                >
                  <NativeSelect
                    id="servico"
                    options={SERVICO}
                    value={form.servico}
                    onChange={(v) => set("servico", v)}
                    error={errors.servico}
                    required
                  />
                </FormField>
              </div>

              {/* 13. Local de Reserva */}
              <FormField
                label="Local de Reserva - Emergencial"
                required
                error={errors.localReserva}
                htmlFor="localReserva"
              >
                <NativeSelect
                  id="localReserva"
                  options={LOCAL_RESERVA}
                  value={form.localReserva}
                  onChange={(v) => set("localReserva", v)}
                  error={errors.localReserva}
                  required
                />
              </FormField>

              {/* 14. Justificativa */}
              <FormField
                label="Justificativa - Emergencial"
                required
                error={errors.justificativa}
                htmlFor="justificativa"
              >
                <NativeSelect
                  id="justificativa"
                  options={JUSTIFICATIVA}
                  value={form.justificativa}
                  onChange={(v) => set("justificativa", v)}
                  error={errors.justificativa}
                  required
                />
              </FormField>

              {/* 15. Fila de Atendimento */}
              <FormField
                label="Fila de Atendimento Emergencial"
                htmlFor="filaAtendimento"
              >
                <NativeSelect
                  id="filaAtendimento"
                  options={FILA}
                  value={form.filaAtendimento}
                  onChange={(v) => set("filaAtendimento", v)}
                />
              </FormField>

              {/* ── Seção: Confirmações ───────────────────────────────────── */}
              <SectionDivider title="Confirmações" />

              {/* 16 & 17. Checkboxes */}
              <div className="flex flex-col gap-3">
                {/* 16 */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.emergencialCopia}
                    onChange={(e) => set("emergencialCopia", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#404653] cursor-pointer accent-[#C2D82F]"
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#404653" }}>
                    Emergencial estava em cópia
                  </span>
                </label>

                {/* 17 */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.emailEnviado}
                    onChange={(e) => set("emailEnviado", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#404653] cursor-pointer accent-[#C2D82F]"
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#404653" }}>
                    E-mail enviado ao emergencial/horário do posto
                  </span>
                </label>
              </div>

              {/* ── Submit error ─────────────────────────────────────────── */}
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
