import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fosidapvbjuijodpvjvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvc2lkYXB2Ymp1aWpvZHB2anZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTg4OTcsImV4cCI6MjA3NjE3NDg5N30.c1ZilgEalwdGoOPCv23WSiyg4EgxaYtac8S8LtBwb68";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function Page({ params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>ID não fornecido</h2>
      </div>
    );
  }

  try {
    const { data, error } = await supabase
      .from("representantes")
      .select("id, nome, whatsapp")
      .eq("id", id)
      .single();

    if (error || !data) {
      return (
        <div style={{ padding: 40, textAlign: "center" }}>
          <h1>404 — Patrocinador não encontrado</h1>
          <p>O código <strong>{id}</strong> não existe no banco.</p>
          <a href="/">Voltar para a página inicial</a>
        </div>
      );
    }

    return (
      <main style={{ fontFamily: "sans-serif", padding: 28 }}>
        <h1 style={{ marginBottom: 8 }}>Federal Associados</h1>
        <p style={{ color: "#666", marginBottom: 18 }}>
          Cadastro de Novo Associado
        </p>

        <div
          style={{
            background: "#07a",
            color: "#fff",
            padding: 18,
            borderRadius: 8,
          }}
        >
          <p style={{ fontWeight: 700 }}>Patrocinador:</p>
          <p style={{ fontSize: 18 }}>{data.nome}</p>
          <p style={{ opacity: 0.9 }}>Código: {data.id}</p>
          <p style={{ opacity: 0.9 }}>WhatsApp: {data.whatsapp}</p>
        </div>

        <section style={{ marginTop: 22 }}>
          <h3>Escolha seu Plano</h3>
          <div style={{ marginTop: 8 }}>
            <label style={{ marginRight: 12 }}>
              <input type="radio" name="chip" defaultChecked /> Físico
            </label>
            <label>
              <input type="radio" name="chip" /> e-SIM
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <select>
              <option>Selecione um plano</option>
              <option>Plano A</option>
              <option>Plano B</option>
            </select>
          </div>
        </section>
      </main>
    );
  } catch (err) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>Erro ao buscar dados</h1>
        <pre style={{ color: "#d33" }}>{String(err)}</pre>
      </div>
    );
  }
}
