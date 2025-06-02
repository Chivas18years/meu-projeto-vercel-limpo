'use client';
import Image from 'next/image';
import { useState } from 'react';

const servicos = [
  {
    titulo: 'CNH - Primeira Habilitação',
    descricao: 'Solicite sua primeira Carteira Nacional de Habilitação',
    url: '/checkout?titulo=CNH+-+Primeira+Habilitação&valor=43.34',
  },
  {
    titulo: 'CNH - Renovação',
    descricao: 'Renove sua Carteira Nacional de Habilitação',
    url: '/checkout?titulo=CNH+-+Renovação&valor=54.24',
  },
  {
    titulo: 'CNH - Adição de Categoria',
    descricao: 'Adicione novas categorias à sua habilitação',
    url: '/checkout?titulo=CNH+-+Adi%C3%A7%C3%A3o+de+Categoria&valor=65.15',
  },
  {
    titulo: 'CNH - Segunda Via',
    descricao: 'Solicite a segunda via da sua Carteira Nacional de Habilitação',
    url: '/checkout?titulo=CNH+-+Segunda+Via&valor=45.25',
  },
];

const faq = [
  {
    pergunta: 'Quanto tempo demora para receber a confirmação do protocolo de agendamento por e-mail?',
    resposta: 'O e-mail com a confirmação do protocolo de seu atendimento chega em até 48 horas após a confirmação de pagamento.',
  },
  {
    pergunta: 'Depois que agendei já posso ir ao posto de atendimento?',
    resposta: 'Não. Só vá ao posto de atendimento com o protocolo de atendimento que enviaremos ao seu e-mail. Este protocolo é a confirmação de que o dia e horário desejado foi devidamente agendado com o posto.',
  },
  {
    pergunta: 'Além da taxa de serviço será cobrado mais algum valor?',
    resposta: 'Para emissão de 1ª via não há outras taxas. Entretando, se for emissão de 2ª via do documento, será cobrado uma taxa de emissão.',
  },
  {
    pergunta: 'Posso desistir após pagar?',
    resposta: 'Sim! Caso o serviço ainda não tenha sido realizado, basta entrar em contato em nossos canais de atendimento que faremos o estorno.',
  },
  {
    pergunta: 'Posso realizar o agendamento sem a assessoria do site?',
    resposta: 'Não. Este é o único canal oficial para realizar o agendamento dos seus documentos. Para sua segurança e garantia do serviço, realize o agendamento somente através deste portal governamental.',
  },
];

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f7fbfb] pt-12 pb-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-[#092046] mb-6 leading-tight">
              Agende seus documentos de trânsito online com facilidade
            </h1>
            <p className="text-[#919db1] text-lg mb-8 max-w-xl">
              Solicite, renove ou atualize sua CNH e outros documentos de trânsito de forma rápida, segura e 100% online. Atendimento oficial, prático e sem complicações.
            </p>
            <a
              href="#servicos"
              className="inline-block bg-[#0550ae] hover:bg-[#092046] text-white font-semibold px-8 py-3 rounded-full shadow transition"
            >
              Ver serviços disponíveis
            </a>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <Image
              src="https://ext.same-assets.com/2670431573/1389812702.svg"
              alt="Ilustração CNH"
              width={320}
              height={320}
              className="w-64 h-64 md:w-80 md:h-80"
              priority
            />
          </div>
        </div>
      </section>

      {/* Seção serviços */}
      <section className="py-16" id="servicos">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#092046]">Serviços Disponíveis</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#092046] mb-6">Selecione o serviço desejado</h3>
                <ul className="divide-y divide-gray-200">
                  {servicos.map((s, i) => (
                    <li key={s.titulo} className="py-4 flex items-center justify-between group hover:bg-[#f7fbfb] transition cursor-pointer">
                      <a className="flex-grow" href={s.url}>
                        <h4 className="text-xl text-[#0550ae] group-hover:text-[#092046] transition font-medium">{s.titulo}</h4>
                        <p className="text-[#919db1] mt-1 text-sm">{s.descricao}</p>
                      </a>
                      <span className="text-[#0550ae] text-lg group-hover:translate-x-2 transition-transform ml-2">→</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Etapas */}
      <section className="py-16 bg-[#f7fbfb]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#092046]">Como solicitar o agendamento online?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
              <Image src="https://ext.same-assets.com/2670431573/1389812702.svg" width={48} height={48} alt="ícone" className="mb-4" />
              <h3 className="text-xl font-bold text-[#092046] mb-4">Preencha o formulário</h3>
              <p className="text-[#919db1]">Clique no botão inicial para ter acesso ao formulário. Preencha os dados até o fim para chegar na tela de pagamento.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
              <Image src="https://ext.same-assets.com/2670431573/627147471.svg" width={48} height={48} alt="ícone" className="mb-4" />
              <h3 className="text-xl font-bold text-[#092046] mb-4">Realize o pagamento</h3>
              <p className="text-[#919db1]">Realize o pagamento do pedido. Após compensado o pagamento, irá receber um e-mail de confirmação.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
              <Image src="https://ext.same-assets.com/2670431573/196566064.svg" width={48} height={48} alt="ícone" className="mb-4" />
              <h3 className="text-xl font-bold text-[#092046] mb-4">Receba tudo por e-mail</h3>
              <p className="text-[#919db1]">Após o confirmado seu pagamento, iremos entrar em contato por e-mail em até 48 horas úteis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#092046]">Dúvidas Frequentes</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faq.map((f, idx) => (
                <div key={f.pergunta} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full text-left p-4 bg-white hover:bg-[#f7fbfb] focus:outline-none flex justify-between items-center"
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  >
                    <span className="text-[#0550ae] font-medium">{f.pergunta}</span>
                    <span className="ml-2 text-[#0550ae]">{faqOpen === idx ? '−' : '+'}</span>
                  </button>
                  {faqOpen === idx && (
                    <div className="bg-white px-4 pb-4">
                      <p className="text-[#919db1]">{f.resposta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção final CTA */}
      <section className="py-16 bg-[#0550ae]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para agendar?</h2>
            <p className="text-[#e3eaf6] text-lg mb-8 max-w-xl">
              Clique abaixo e inicie seu atendimento online agora mesmo. É rápido, seguro e oficial.
            </p>
            <a
              href="#servicos"
              className="inline-block bg-white hover:bg-[#e3eaf6] text-[#0550ae] font-semibold px-8 py-3 rounded-full shadow transition"
            >
              Começar agora
            </a>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <Image
              src="https://ext.same-assets.com/2670431573/627147471.svg"
              alt="Ilustração CTA"
              width={220}
              height={220}
              className="w-44 h-44 md:w-56 md:h-56"
            />
          </div>
        </div>
      </section>
    </>
  );
}
