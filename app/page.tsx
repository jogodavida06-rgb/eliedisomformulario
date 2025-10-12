import RegistrationForm from "@/components/registration-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl w-full md:w-auto px-4 md:px-0" style={{ width: '90%', maxWidth: '56rem' }}>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Federal Associados</h1>
            <p className="text-gray-600">Complete seu cadastro e escolha seu plano</p>
            <p className="text-gray-700 mt-2 font-medium">Patrocinador: Francisco Eliedisom Dos Santos</p>
          </div>
          <RegistrationForm />
        </div>
        <footer className="text-center mt-8 text-sm text-gray-600">
          <p>2025 © Federal Associados (CNPJ 29.383-343-0001/64) - Todos os direitos reservados |</p>
        </footer>
      </div>
    </main>
  )
}
