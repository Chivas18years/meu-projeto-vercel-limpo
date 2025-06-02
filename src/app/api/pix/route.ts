import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { pixConfigs } from "~/server/db/schema";

export async function GET() {
  try {
    // Buscar configurações PIX do banco de dados
    const config = await db.query.pixConfigs.findFirst();
    
    if (config) {
      // Converter o valor para número se existir
      const pixValue = config.pixValue ? parseFloat(config.pixValue) : null;
      
      return NextResponse.json({ 
        key: config.pixKey,
        value: pixValue
      });
    }
    
    // Fallback para a chave padrão se não houver configuração
    return NextResponse.json({ 
      key: "b6399e0e-80f6-4b0b-b773-8a738569699b",
      value: null
    });
  } catch (error) {
    console.error("Erro ao buscar configurações PIX:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações PIX" },
      { status: 500 }
    );
  }
}
