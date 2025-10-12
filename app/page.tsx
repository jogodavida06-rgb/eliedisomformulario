import RegistrationForm from "@/components/registration-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Federal Associados</h1>
            <p className="text-gray-600">Complete seu cadastro e escolha seu plano</p>
          </div>
          <RegistrationForm />
        </div>
      </div>
    </main>
  )
}
