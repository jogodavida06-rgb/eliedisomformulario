import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { billing_id } = await request.json()

    const formData = new URLSearchParams()
    formData.append("_token", "VLjf9CpfbxGDZf6pJBskWZPwgzAitvdRdvLmFkP3")
    formData.append("billing_id", billing_id)

    const response = await fetch("https://federalassociados.com.br/registerBilletCaixa/externo", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Erro ao gerar boleto" }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      boleto_link: data.billing?.boleto_link || data.url,
    })
  } catch (error) {
    console.error("[v0] Erro ao gerar boleto:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
