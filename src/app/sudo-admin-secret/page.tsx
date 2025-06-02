import { auth, signOut } from "~/server/auth";
import { db } from "~/server/db";
import { pixConfigs, clients } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import React from "react";
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";

// Componente para editar a configuração do PIX
async function PixConfigEditor() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    // Este componente não deve renderizar nada se o usuário não for admin
    // A proteção principal está na AdminPage
    return null;
  }
  let config = await db.query.pixConfigs.findFirst();

  async function updatePix(formData: FormData) {
    "use server";
    
    try {
      const pixKey = formData.get("pixKey") as string;
      const pixValue = formData.get("pixValue") as string;
      const currentSession = await auth(); // Usar auth() para Server Actions também

      if (!currentSession || currentSession.user?.role !== "admin") {
        throw new Error("Não autorizado");
      }

      console.log("Atualizando PIX com:", { pixKey, pixValue });
      
      if (config && config.id) {
        await db.update(pixConfigs)
          .set({ 
            pixKey, 
            pixValue,
            updatedAt: new Date()
          })
          .where(eq(pixConfigs.id, config.id));
        console.log("PIX atualizado com sucesso (update)");
      } else {
        await db.insert(pixConfigs)
          .values({ 
            pixKey, 
            pixValue,
            createdAt: new Date()
          });
        console.log("PIX criado com sucesso (insert)");
      }
      
      // Revalidar a página para mostrar os dados atualizados
      revalidatePath("/sudo-admin-secret");
      
      return { success: true, message: "Configuração PIX atualizada com sucesso!" };
    } catch (error) {
      console.error("Erro ao atualizar PIX:", error);
      return { success: false, message: "Erro ao atualizar configuração PIX. Tente novamente." };
    }
  }

  return (
    <div className="mb-8 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Configuração da Chave PIX</h2>
      <form action={updatePix} className="space-y-3">
        <div>
          <label htmlFor="pixKey" className="block text-sm font-medium">Chave PIX:</label>
          <input 
            type="text" 
            name="pixKey" 
            id="pixKey" 
            defaultValue={config?.pixKey ?? ""} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            required 
          />
        </div>
        <div>
          <label htmlFor="pixValue" className="block text-sm font-medium">Valor Padrão (opcional):</label>
          <input 
            type="text" 
            name="pixValue" 
            id="pixValue" 
            defaultValue={config?.pixValue ?? ""} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Salvar Configuração PIX
        </button>
      </form>
    </div>
  );
}

// Componente para listar os clientes
async function ClientsTable() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return null; 
  }
  const allClients = await db.query.clients.findMany();

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Lista de Clientes</h2>
      {allClients.length === 0 ? (
        <p>Nenhum cliente cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.cpf}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.ipAddress ?? "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function AdminPage() {
  const session = await auth();
  console.log("Admin Page - Session:", session);

  if (!session?.user) {
    console.log("Admin Page - No session, redirecting to login");
    return redirect("/api/auth/signin?callbackUrl=/sudo-admin-secret");
  }

  if (session.user.role !== "admin") {
    console.log("Admin Page - User not admin:", session.user.email);
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <p><a href="/" className="text-blue-500 hover:underline">Voltar para Home</a></p>
      </div>
    );
  }

  console.log("Admin Page - Admin access granted to:", session.user.email);
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-sm text-gray-600">Bem-vindo, {session.user.name ?? session.user.email}!</p>
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}>
          <button type="submit" className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm">Sair</button>
        </form>
      </header>
      
      <main>
        <PixConfigEditor />
        <ClientsTable />
      </main>
    </div>
  );
}
