"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importar useRouter
import { submitCheckoutForm } from "./actions"; // Importar a Server Action

const masks = {
  cpf: (v: string) => v.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2").slice(0,14),
  tel: (v: string) => v.replace(/\D/g,"").replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d{1,4})$/,"$1-$2").slice(0, 15),
  cep: (v: string) => v.replace(/\D/g,"").replace(/(\d{5})(\d{1,3})$/, "$1-$2").slice(0, 9),
};

export default function Checkout() {
  const router = useRouter(); // Hook para navegação
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    nascimento: "",
    email: "",
    telefone: "",
    tipo: "",
    categoria: "",
    endereco: "",
    cep: "",
    uf: "",
    cidade: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: any) {
    const { name, value } = e.target;
    let v = value;
    if (name === "cpf") v = masks.cpf(v);
    if (name === "telefone") v = masks.tel(v);
    if (name === "cep") v = masks.cep(v);
    setForm(f => ({ ...f, [name]: v }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitCheckoutForm(formData, undefined); // IP será capturado na action se possível

    setLoading(false);
    if (result.success) {
      setEnviado(true);
      setTimeout(() => {
        router.push("/pagamento");
      }, 2000);
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.");
    }
  }

  if (enviado) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Image src="https://ext.same-assets.com/2670431573/627147471.svg" width={60} height={60} alt="sucesso" className="mb-4" />
        <h2 className="text-2xl font-bold text-[#092046] mb-2">Dados enviados com sucesso!</h2>
        <p className="text-[#919db1] mb-4">Aguarde enquanto preparamos a tela de pagamento PIX…</p>
        <div className="animate-pulse h-3 w-3 bg-[#0550ae] rounded-full" />
      </div>
    );
  }

  return (
    <section className="py-12 min-h-[90vh] bg-[#f7fbfb] flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#092046] mb-6 text-center">Preencha os dados para iniciar o agendamento</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="grid gap-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="font-medium text-[#092046]">Nome completo *</label>
            <input type="text" name="nome" required value={form.nome} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-[#092046]">CPF *</label>
              <input type="text" name="cpf" required value={form.cpf} onChange={handleChange} maxLength={14} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
            </div>
            <div>
              <label className="font-medium text-[#092046]">Data de nascimento *</label>
              <input type="date" name="nascimento" required value={form.nascimento} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-[#092046]">E-mail *</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
            </div>
            <div>
              <label className="font-medium text-[#092046]">Telefone *</label>
              <input type="text" name="telefone" required value={form.telefone} maxLength={15} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-[#092046]">Tipo de CNH *</label>
              <select name="tipo" required value={form.tipo} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-white text-[#092046]">
                <option value="">Selecione</option>
                <option value="Primeira Habilitação">Primeira Habilitação</option>
                <option value="Renovação">Renovação</option>
                <option value="Adição de Categoria">Adição de Categoria</option>
                <option value="Segunda Via">Segunda Via</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-[#092046]">Categoria desejada *</label>
              <select name="categoria" required value={form.categoria} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-white text-[#092046]">
                <option value="">Selecione</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-medium text-[#092046]">Endereço completo *</label>
            <input type="text" name="endereco" required value={form.endereco} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-[#092046]">CEP *</label>
              <input type="text" name="cep" required value={form.cep} onChange={handleChange} maxLength={9} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
            </div>
            <div>
              <label className="font-medium text-[#092046]">UF *</label>
              <input type="text" name="uf" required value={form.uf} onChange={handleChange} maxLength={2} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] uppercase focus:ring focus:outline-none" />
            </div>
            <div>
              <label className="font-medium text-[#092046]">Cidade *</label>
              <input type="text" name="cidade" required value={form.cidade} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 text-[#092046] focus:ring focus:outline-none" />
            </div>
          </div>
          <button disabled={loading} type="submit" className="mt-4 w-full bg-[#0550ae] hover:bg-[#092046] text-white font-semibold py-3 rounded shadow transition disabled:opacity-60">
            {loading ? "Enviando..." : "Avançar para pagamento PIX"}
          </button>
        </form>
      </div>
    </section>
  );
}

