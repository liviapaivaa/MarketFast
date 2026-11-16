
import { useState } from "react";
import { supabase } from "./utils/supabase";

type AuthProps = {
  onLogin: (tipo: string) => void;
};

export default function Auth({ onLogin }: AuthProps) {
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("consumidor");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviarFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);

    try {
      if (modo === "cadastro") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: { nome, telefone, tipo },
          },
        });

        if (error) throw error;

        if (data.user && data.session) {
          const { error: perfilError } = await supabase
            .from("perfis")
            .insert({
              id: data.user.id,
              nome,
              telefone,
              tipo,
            });

          if (perfilError) throw perfilError;

          onLogin(tipo);
        } else {
          setMensagem(
            "Cadastro realizado! Confira seu e-mail para confirmar a conta."
          );
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

        if (error) throw error;

        const { data: perfil, error: perfilError } = await supabase
          .from("perfis")
          .select("tipo")
          .eq("id", data.user.id)
          .single();

        if (perfilError) throw perfilError;

        onLogin(perfil.tipo);
      }
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar a operação."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form
        onSubmit={enviarFormulario}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-[#123B3D]">
          MarketFast
        </h1>

        <h2 className="text-xl font-semibold">
          {modo === "login" ? "Entrar na conta" : "Criar conta"}
        </h2>

        {modo === "cadastro" && (
          <>
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <label className="block text-sm font-medium">
              Tipo de conta
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="consumidor">Consumidor</option>
              <option value="comerciante">Comerciante</option>
              <option value="entregador">Entregador</option>
            </select>
          </>
        )}

        <input
          className="w-full rounded-lg border p-3"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border p-3"
          type="password"
          placeholder="Senha (mínimo de 6 caracteres)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          minLength={6}
          required
        />

        {mensagem && (
          <p className="text-sm text-red-600">{mensagem}</p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-lg bg-[#123B3D] p-3 font-bold text-white disabled:opacity-50"
        >
          {carregando
            ? "Aguarde..."
            : modo === "login"
              ? "Entrar"
              : "Cadastrar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setModo(modo === "login" ? "cadastro" : "login");
            setMensagem("");
          }}
          className="w-full text-sm text-[#123B3D] underline"
        >
          {modo === "login"
            ? "Ainda não tem conta? Cadastre-se"
            : "Já tem conta? Entrar"}
        </button>
      </form>
    </main>
  );
}
