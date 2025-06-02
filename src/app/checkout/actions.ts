"use server";

// Importar db e schema aqui dentro da server action
import { db } from "~/server/db";
import { clients } from "~/server/db/schema";

export async function submitCheckoutForm(formData: FormData, ipAddress: string | undefined) {
  // Acessar diretamente os campos do FormData
  const nome = formData.get("nome") as string;
  const cpf = formData.get("cpf") as string;
  const nascimento = formData.get("nascimento") as string;
  const email = formData.get("email") as string;
  const telefone = formData.get("telefone") as string;
  const tipo = formData.get("tipo") as string;
  const categoria = formData.get("categoria") as string;
  const endereco = formData.get("endereco") as string;
  const cep = formData.get("cep") as string;
  const uf = formData.get("uf") as string;
  const cidade = formData.get("cidade") as string;

  try {
    await db.insert(clients).values({
      name: nome,
      cpf: cpf,
      birthDate: nascimento,
      email: email,
      phone: telefone,
      cnhType: tipo,
      cnhCategory: categoria,
      address: endereco,
      cep: cep,
      uf: uf,
      city: cidade,
      ipAddress: ipAddress ?? "IP não capturado",
      serviceRequested: `${tipo} - ${categoria}`, // Exemplo de serviço
      paymentStatus: "pending", // Status inicial
    });
    console.log("Cliente salvo no banco de dados:", email);
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    return { success: false, error: "Falha ao salvar os dados. Tente novamente." };
  }
}

