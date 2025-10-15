'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { checkRepresentativeAuth, type Representative } from '@/lib/supabase'
import RegistrationForm from '@/components/registration-form'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function RepresentativePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [representative, setRepresentative] = useState<Representative | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function validateRepresentative() {
      const repId = params.repId as string

      if (!repId || isNaN(Number(repId))) {
        setError(true)
        setLoading(false)
        return
      }

      const rep = await checkRepresentativeAuth(Number(repId))

      if (!rep) {
        setError(true)
        setLoading(false)
        return
      }

      setRepresentative(rep)
      setLoading(false)
    }

    validateRepresentative()
  }, [params.repId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando autorização...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !representative) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Não Autorizado</h2>
              <p className="text-gray-600 mb-6">
                Você não está autorizado a acessar este formulário.
                Procure seu líder ou representante oficial para obter um link válido.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <RegistrationForm repId={representative.rep_id} whatsapp={representative.whatsapp} />
}
