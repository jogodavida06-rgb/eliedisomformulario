"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef } from "react"

interface WelcomeVideoProps {
  onContinue: () => void
}

export default function WelcomeVideo({ onContinue }: WelcomeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 md:py-12 px-2 md:px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-4xl w-full px-3 sm:px-6 md:px-8">
        <Card className="shadow-xl">
          <CardContent className="pt-8 pb-8 px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center leading-relaxed">
              Seja muito bem-vindo(a) à Família Federal Associados. Para finalizar o seu cadastro assista ao vídeo abaixo para realizar a sua adesão
            </h1>

            <div className="mb-8 rounded-lg overflow-hidden shadow-lg bg-black">
              <video
                ref={videoRef}
                controls
                className="w-full"
                preload="auto"
                playsInline
              >
                <source
                  src="https://myehbxfidszreorsaexi.supabase.co/storage/v1/object/public/adesao/adesao.mp4"
                  type="video/mp4"
                />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-6 h-auto"
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
