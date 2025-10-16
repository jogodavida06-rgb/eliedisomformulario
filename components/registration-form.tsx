"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import ErrorModal from "@/components/error-modal"
import { Shield, CircleCheck, Smartphone, User, Phone, MapPin, Package } from "lucide-react"

const REFERRAL_ID = "110956"
const DEFAULT_WHATSAPP = "5584981321396"

interface RegistrationFormProps {
  repId?: string
  repWhatsApp?: string
  repName?: string
}

const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

const PLANS = {
  VIVO: [
    { id: "178", name: "40GB COM LIGACAO", price: 49.9, esim: true },
    { id: "69", name: "80GB COM LIGACAO", price: 69.9, esim: true },
    { id: "61", name: "150GB COM LIGACAO", price: 99.9, esim: true },
  ],
  TIM: [
    { id: "56", name: "100GB COM LIGACAO", price: 69.9, esim: true },
    { id: "154", name: "200GB SEM LIGAÇÃO", price: 159.9, esim: true },
    { id: "155", name: "300GB SEM LIGAÇÃO", price: 199.9, esim: true },
  ],
  CLARO: [
    { id: "57", name: "80GB COM LIGACAO", price: 69.9, esim: true },
    { id: "183", name: "150GB COM LIGACAO", price: 99.9, esim: true },
  ],
}

export default function RegistrationForm({ repId, repWhatsApp, repName }: RegistrationFormProps = {}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [cpfValidated, setCpfValidated] = useState(false)
  const [emailValidated, setEmailValidated] = useState(false)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    cpf: "",
    birth: "",
    name: "",
    email: "",
    phone: "",
    cell: "",
    cep: "",
    district: "",
    city: "",
    state: "",
    street: "",
    number: "",
    complement: "",
    typeChip: "fisico",
    coupon: "",
    plan_id: "",
    typeFrete: "",
  })

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{0,3})/, "$1-$2")
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cpf") {
      formattedValue = formatCPF(value)
    } else if (field === "phone" || field === "cell") {
      formattedValue = formatPhone(value)
    } else if (field === "cep") {
      formattedValue = formatCEP(value)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
  }

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "")
    if (cleanCEP.length !== 8) return

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || "",
          district: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }))
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    }
  }

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, "")
    if (cleanCPF.length !== 11) return false

    if (/^(\d)\1{10}$/.test(cleanCPF)) return false

    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.substring(10, 11))) return false

    return true
  }

  const validateCPFWithAPI = async (cpf: string, birth: string) => {
    const cleanCPF = cpf.replace(/\D/g, "")
    if (cleanCPF.length !== 11 || !birth) return

    try {
      const [year, month, day] = birth.split("-")
      const formattedBirth = `${day}-${month}-${year}`

      const response = await fetch(
        `https://apicpf.whatsgps.com.br/api/cpf/search?numeroDeCpf=${cleanCPF}&dataNascimento=${formattedBirth}&token=2|VL3z6OcyARWRoaEniPyoHJpPtxWcD99NN2oueGGn4acc0395`,
      )
      const data = await response.json()

      if (data.data && data.data.id) {
        setFormData((prev) => ({
          ...prev,
          name: data.data.nome_da_pf || prev.name,
        }))
        setCpfValidated(true)
        toast({
          title: "CPF validado!",
          description: "Dados preenchidos automaticamente.",
        })
      } else {
        toast({
          title: "CPF não encontrado",
          description: "Verifique o CPF e data de nascimento.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao validar CPF:", error)
    }
  }

  const validateEmail = async (email: string) => {
    if (!email) return

    try {
      const response = await fetch(`https://federalassociados.com.br/getEmail/${email}`)
      const data = await response.json()

      if (data.status === "success") {
        setEmailValidated(true)
        toast({
          title: "Email validado!",
          description: "Email confirmado com sucesso.",
        })
      } else if (data.status === "error") {
        toast({
          title: "Erro",
          description: data.msg || "Email já cadastrado ou inválido.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao validar email:", error)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.plan_id) {
          setErrorMessage("Por favor, selecione um plano antes de continuar.")
          setShowErrorModal(true)
          return false
        }
        return true
      case 2:
        if (!formData.cpf || !formData.birth || !formData.name) {
          setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
          setShowErrorModal(true)
          return false
        }
        if (!validateCPF(formData.cpf)) {
          setErrorMessage("CPF inválido! Por favor, verifique o CPF informado.")
          setShowErrorModal(true)
          return false
        }
        return true
      case 3:
        if (!formData.email || !formData.phone || !formData.cell) {
          setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
          setShowErrorModal(true)
          return false
        }
        return true
      case 4:
        if (!formData.cep || !formData.district || !formData.city || !formData.state || !formData.street) {
          setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
          setShowErrorModal(true)
          return false
        }
        return true
      case 5:
        if (!formData.typeFrete) {
          setErrorMessage("Por favor, selecione a forma de envio antes de continuar.")
          setShowErrorModal(true)
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(5)) {
      return
    }

    setLoading(true)

    if (!validateCPF(formData.cpf)) {
      setErrorMessage("CPF inválido! Por favor, verifique o CPF informado.")
      setShowErrorModal(true)
      setLoading(false)
      return
    }

    if (!formData.plan_id) {
      setErrorMessage("Por favor, selecione um plano antes de continuar.")
      setShowErrorModal(true)
      setLoading(false)
      return
    }

    if (!formData.typeFrete) {
      setErrorMessage("Por favor, selecione a forma de envio antes de continuar.")
      setShowErrorModal(true)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          father: repId || REFERRAL_ID,
          status: "0",
          type: "Recorrente",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Redirecionando para o WhatsApp...",
        })

        let carrier = ""
        let planName = ""

        if (PLANS.VIVO.find(plan => plan.id === formData.plan_id)) {
          carrier = "Vivo"
          const selectedPlan = PLANS.VIVO.find(plan => plan.id === formData.plan_id)
          planName = selectedPlan ? selectedPlan.name : formData.plan_id
        } else if (PLANS.TIM.find(plan => plan.id === formData.plan_id)) {
          carrier = "Tim"
          const selectedPlan = PLANS.TIM.find(plan => plan.id === formData.plan_id)
          planName = selectedPlan ? selectedPlan.name : formData.plan_id
        } else if (PLANS.CLARO.find(plan => plan.id === formData.plan_id)) {
          carrier = "Claro"
          const selectedPlan = PLANS.CLARO.find(plan => plan.id === formData.plan_id)
          planName = selectedPlan ? selectedPlan.name : formData.plan_id
        }

        const fullPlanName = `${carrier} ${planName}`

        const chipType = formData.typeChip === "fisico" ? "Físico" : "e-SIM"

        let shippingType = ""
        if (formData.typeFrete === "Carta") {
          shippingType = "Enviar via Carta Registrada"
        } else if (formData.typeFrete === "semFrete") {
          shippingType = "Retirar na Associação ou com um Associado"
        } else if (formData.typeFrete === "eSim") {
          shippingType = "Sem a necessidade de envio (e-SIM)"
        }

        const whatsappMessage = encodeURIComponent(
          `Acabei de realizar meu cadastro.\n\nPlano escolhido: ${fullPlanName}.\nTipo de chip: ${chipType}.\nForma de envio: ${shippingType}.\n\nQuais os próximos passos?`
        )

        const whatsappNumber = repWhatsApp || DEFAULT_WHATSAPP

        setTimeout(() => {
          window.location.href = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`
        }, 1500)
      } else {
        if (response.status === 422 && data.errors) {
          const errorFields = Object.keys(data.errors)
          const errorMessages: string[] = []

          if (errorFields.includes("cpf")) {
            errorMessages.push("CPF já cadastrado no sistema!")
          }
          if (errorFields.includes("email")) {
            errorMessages.push("Email já cadastrado no sistema!")
          }
          if (errorFields.includes("cell")) {
            errorMessages.push("WhatsApp já cadastrado no sistema!")
          }

          errorFields.forEach((field) => {
            if (!["cpf", "email", "cell"].includes(field)) {
              const messages = data.errors[field] as string[]
              errorMessages.push(messages.join(", "))
            }
          })

          const finalMessage =
            errorMessages.length > 0
              ? `${errorMessages.join(" ")} Por favor, use outros dados ou entre em contato pelo WhatsApp 0800-6262-345 para correção.`
              : "Erro ao processar cadastro. Verifique os dados e tente novamente."

          setErrorMessage(finalMessage)
          setShowErrorModal(true)
        } else {
          setErrorMessage(data.message || "Erro ao processar cadastro. Verifique os dados e tente novamente.")
          setShowErrorModal(true)
        }
      }
    } catch (error) {
      setErrorMessage("Não foi possível completar o cadastro. Verifique sua conexão e tente novamente.")
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (formData.typeChip === "eSim") {
      setFormData(prev => ({ ...prev, typeFrete: "eSim" }))
    } else if (formData.typeFrete === "eSim") {
      setFormData(prev => ({ ...prev, typeFrete: "" }))
    }
  }, [formData.typeChip])

  const sponsorName = repName || "Francisco Eliedisom Dos Santos"
  const sponsorCode = repId || REFERRAL_ID

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 p-6 md:p-8 text-white relative">
              <div className="absolute top-6 right-6">
                <Shield className="w-12 h-12 opacity-20" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Federal Associados</h1>
              <p className="text-white/90 mb-6">Cadastro de Novo Associado</p>

              <div className="bg-cyan-300/20 backdrop-blur-sm rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-cyan-50 mb-1">Patrocinador</p>
                <p className="text-lg font-bold text-white">{sponsorName}</p>
                <p className="text-sm text-cyan-100 mt-1">Código: {sponsorCode}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Escolha seu Plano</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-gray-700">Tipo de Chip</Label>
                      <RadioGroup
                        value={formData.typeChip}
                        onValueChange={(value) => {
                          handleInputChange("typeChip", value)
                          handleInputChange("plan_id", "")
                        }}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fisico" id="fisico" />
                          <Label htmlFor="fisico" className="font-normal cursor-pointer text-gray-700">
                            Físico
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="eSim" id="eSim-chip" />
                          <Label htmlFor="eSim-chip" className="font-normal cursor-pointer text-gray-700">
                            e-SIM
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="plan" className="text-base font-semibold text-gray-700">
                        Plano <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.plan_id}
                        onValueChange={(value) => handleInputChange("plan_id", value)}
                        required
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-2 text-sm font-bold text-purple-600">VIVO</div>
                          {PLANS.VIVO.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id} className="py-3">
                              VIVO - {plan.name} - R$ {plan.price.toFixed(2).replace('.', ',')}
                            </SelectItem>
                          ))}

                          <div className="px-2 py-2 text-sm font-bold text-blue-600 mt-2">TIM</div>
                          {PLANS.TIM.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id} className="py-3">
                              TIM - {plan.name} - R$ {plan.price.toFixed(2).replace('.', ',')}
                            </SelectItem>
                          ))}

                          <div className="px-2 py-2 text-sm font-bold text-red-600 mt-2">CLARO</div>
                          {PLANS.CLARO.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id} className="py-3">
                              CLARO - {plan.name} - R$ {plan.price.toFixed(2).replace('.', ',')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Dados Pessoais</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-gray-700 font-medium">
                        CPF <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                        className={`h-11 ${cpfValidated ? "border-green-500" : ""}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birth" className="text-gray-700 font-medium">
                        Data de Nascimento <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="birth"
                        type="date"
                        value={formData.birth}
                        onChange={(e) => handleInputChange("birth", e.target.value)}
                        onBlur={(e) => validateCPFWithAPI(formData.cpf, e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Digite seu nome completo"
                        required
                        readOnly={cpfValidated}
                        className={`h-11 ${cpfValidated ? "border-green-500" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Informações de Contato</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onBlur={(e) => validateEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className={`h-11 ${emailValidated ? "border-green-500" : ""}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Telefone <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(00) 0000-0000"
                          maxLength={15}
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cell" className="text-gray-700 font-medium">
                          Celular <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="cell"
                          value={formData.cell}
                          onChange={(e) => handleInputChange("cell", e.target.value)}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Endereço</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-gray-700 font-medium">
                        CEP <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => handleInputChange("cep", e.target.value)}
                        onBlur={(e) => fetchAddressByCEP(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-700 font-medium">
                        Cidade <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Cidade"
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-700 font-medium">
                        Estado <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRAZILIAN_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="district" className="text-gray-700 font-medium">
                        Bairro <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        placeholder="Bairro"
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street" className="text-gray-700 font-medium">
                        Endereço <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => handleInputChange("street", e.target.value)}
                        placeholder="Rua, Avenida..."
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number" className="text-gray-700 font-medium">Número</Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => handleInputChange("number", e.target.value)}
                        placeholder="Nº"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <Label htmlFor="complement" className="text-gray-700 font-medium">Complemento</Label>
                      <Input
                        id="complement"
                        value={formData.complement}
                        onChange={(e) => handleInputChange("complement", e.target.value)}
                        placeholder="Apto, Bloco, etc."
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Forma de Envio</h2>
                  </div>

                  <RadioGroup
                    value={formData.typeFrete}
                    onValueChange={(value) => handleInputChange("typeFrete", value)}
                    className="space-y-4"
                  >
                    {formData.typeChip === "fisico" && (
                      <>
                        <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value="Carta" id="carta" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="carta" className="font-semibold text-gray-900 cursor-pointer block mb-1">
                                Enviar via Carta Registrada
                              </Label>
                              <p className="text-sm text-gray-600">
                                Para quem vai receber o chip pelos Correios
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value="semFrete" id="semFrete" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="semFrete" className="font-semibold text-gray-900 cursor-pointer block mb-1">
                                Retirar na Associação ou com um Associado
                              </Label>
                              <p className="text-sm text-gray-600">
                                Se você vai retirar o chip pessoalmente com um representante ou no caso dos planos da Vivo, vai comprar um chip para ativar de forma imediata
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.typeChip === "eSim" && (
                      <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="eSim" id="eSim" />
                          <Label htmlFor="eSim" className="font-semibold text-gray-900 cursor-pointer">
                            Sem a necessidade de envio (e-SIM)
                          </Label>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </div>
              )}

              <div className="flex gap-3 justify-between items-center mt-8 pt-6 border-t">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack} className="px-6">
                    Voltar
                  </Button>
                ) : (
                  <div></div>
                )}
                {currentStep < 5 ? (
                  <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-8">
                    {loading ? "Processando..." : "Concluir Cadastro"}
                  </Button>
                )}
              </div>
            </form>

          </div>
        </div>
      </div>

      <ErrorModal open={showErrorModal} onOpenChange={setShowErrorModal} message={errorMessage} />
    </>
  )
}
