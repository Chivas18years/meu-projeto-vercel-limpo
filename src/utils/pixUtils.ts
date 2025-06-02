/**
 * Utilitários para geração de QR Code PIX seguindo o padrão EMV/BRCode
 * Implementação baseada na especificação do Banco Central do Brasil
 * https://www.bcb.gov.br/estabilidadefinanceira/pix
 */

/**
 * Calcula o CRC16 (Cyclic Redundancy Check) para a string do PIX
 * @param str String para calcular o CRC
 * @returns String hexadecimal do CRC16
 */
export function calcCRC16(str: string): string {
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
export function gerarCodigoPix(params: {
  chave: string;
  nome: string;
  cidade: string;
  valor: number;
  txid?: string;
  descricao?: string;
}): string {
  const { chave, nome, cidade, valor, txid = '***', descricao = '' } = params;
  
  // Formatar valor com 2 casas decimais e sem ponto
  const valorFormatado = valor.toFixed(2).replace('.', '');
  
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
