"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";

/**
 * Calcula o CRC16 (Cyclic Redundancy Check) para a string do PIX
 * @param str String para calcular o CRC
 * @returns String hexadecimal do CRC16
 */
function calcCRC16(str: string): string {
  // Polinômio para cálculo do CRC16: 0x1021 (padrão CCITT)
  const polynomial = 0x1021;
  let crc = 0xFFFF;

  // Converter string para array de bytes
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }

  // Calcular CRC16
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }

  // Aplicar máscara e converter para hexadecimal
  crc &= 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera o código PIX (BRCode) para pagamentos
 * @param params Parâmetros para geração do código PIX
 * @returns String do código PIX para cópia e colagem ou QR Code
 */
function gerarCodigoPix(params: {
  chave: string;
  nome: string;
  cidade: string;
  valor: number;
  txid?: string;
  descricao?: string;
}): string {
  const { chave, nome, cidade, valor, txid = '***', descricao = '' } = params;
  
  // Formatar valor com 2 casas decimais e COM ponto (padrão BRCode)
  const valorFormatado = valor.toFixed(2);
  
  // Limitar tamanho dos campos conforme especificação
  const nomeFormatado = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25);
  const cidadeFormatada = cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15);
  const descricaoFormatada = descricao.slice(0, 50);
  
  // Montar os campos do código PIX
  const camposPix = [
    { id: '00', valor: '01' },                                      // Payload Format Indicator
    { id: '01', valor: '11' },                                      // Point of Initiation Method (11 = QR estático)
    { 
      id: '26', 
      valor: [                                                      // Merchant Account Information
        { id: '00', valor: 'BR.GOV.BCB.PIX' },                      // GUI do PIX
        { id: '01', valor: chave }                                  // Chave PIX
      ].map(subcampo => `${subcampo.id}${subcampo.valor.length.toString().padStart(2, '0')}${subcampo.valor}`).join('')
    },
    { id: '52', valor: '0000' },                                    // Merchant Category Code (0000 = informação genérica)
    { id: '53', valor: '986' },                                     // Transaction Currency (986 = BRL)
    { id: '54', valor: valorFormatado },                            // Transaction Amount
    { id: '58', valor: 'BR' },                                      // Country Code
    { id: '59', valor: nomeFormatado },                             // Merchant Name
    { id: '60', valor: cidadeFormatada },                           // Merchant City
    { id: '62', valor: [                                            // Additional Data Field
      { id: '05', valor: txid }                                     // Reference Label (TxId)
    ].map(subcampo => `${subcampo.id}${subcampo.valor.length.toString().padStart(2, '0')}${subcampo.valor}`).join('') }
  ];

  // Se houver descrição, adicionar ao campo 62 (Additional Data Field)
  if (descricaoFormatada) {
    const campo62 = camposPix.find(campo => campo.id === '62');
    if (campo62) {
      campo62.valor = [
        { id: '05', valor: txid },                                  // Reference Label (TxId)
        { id: '08', valor: descricaoFormatada }                     // Purpose of Transaction (descrição)
      ].map(subcampo => `${subcampo.id}${subcampo.valor.length.toString().padStart(2, '0')}${subcampo.valor}`).join('');
    }
  }

  // Montar a string do código PIX
  let codigoPix = camposPix.map(campo => {
    return `${campo.id}${campo.valor.length.toString().padStart(2, '0')}${campo.valor}`;
  }).join('');

  // Adicionar campo do CRC (sempre por último)
  codigoPix += '6304';
  
  // Calcular e adicionar o valor do CRC
  const crc = calcCRC16(codigoPix);
  codigoPix += crc;

  return codigoPix;
}

export default function Pagamento() {
  const [loading, setLoading] = useState(true);
  const [chavePix, setChavePix] = useState("");
  const [valor, setValor] = useState(0); // Será definido pela API
  const [pixCopiaCola, setPixCopiaCola] = useState("");
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Buscar chave PIX e valor do backend
    fetch("/api/pix").then(async r => {
      const contentType = r.headers.get("content-type");
      if (r.ok && contentType && contentType.includes("application/json")) {
        const data = await r.json();
        setChavePix(data.key || "");
        
        // Usar o valor do painel admin se disponível, ou usar valor padrão
        const valorPix = data.value !== null ? data.value : 49.90;
        setValor(valorPix);
        
        console.log("Dados PIX recebidos:", { chave: data.key, valor: valorPix });
        
        // Montar código PIX usando a nova função que segue o padrão do Banco Central
        const pix = gerarCodigoPix({
          chave: data.key || "00000000000",
          nome: "Servico CNH", 
          cidade: "SAO PAULO",
          valor: valorPix,
          txid: "CNHSRV" + new Date().getTime().toString().slice(-8),
          descricao: "Pagamento Servico CNH"
        });
        
        setPixCopiaCola(pix);
        console.log("Código PIX gerado:", pix);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Erro ao buscar chave PIX:", err);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-8 min-h-[80vh] flex items-center justify-center bg-[#f7fbfb]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#092046] mb-6 text-center">Pagamento via PIX</h1>
        {loading ? (
          <div className="my-12 animate-pulse h-6 w-6 rounded-full bg-[#0550ae]" />
        ) : (
          <>
            <p className="mb-2 text-[#092046] font-medium text-lg text-center">Escaneie o QR Code abaixo ou copie o código PIX.</p>
            <div className="my-6 bg-white p-4 rounded shadow flex flex-col items-center gap-4">
              <QRCode value={pixCopiaCola} size={190} renderAs="svg" includeMargin={true} />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(pixCopiaCola);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1700);
                }} 
                className="mt-2 px-5 py-2 rounded bg-[#0550ae] hover:bg-[#092046] text-white font-semibold transition"
              >
                {copied ? "Copiado!" : "Copiar código"}
              </button>
              <input 
                value={pixCopiaCola} 
                readOnly 
                className="w-full bg-gray-100 p-2 rounded text-xs text-[#092046] mt-2 select-all" 
              />
            </div>
            <div className="text-center mt-8">
              <button className="bg-[#55a56b] hover:bg-[#086d3b] text-white px-8 py-3 rounded font-bold shadow transition">
                Já paguei!
              </button>
            </div>
            <p className="text-[#919db1] mt-4 text-sm">
              Após a confirmação do pagamento, sua solicitação será processada e você receberá um e-mail em até 48h úteis.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
