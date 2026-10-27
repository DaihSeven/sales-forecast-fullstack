// Cores e estilos compartilhados por todas as telas.
// Há duas paletas (tema claro e escuro) com os mesmos nomes de cor; os
// estilos são gerados a partir da paleta escolhida. As telas pegam o
// resultado com o hook useTema() (ver tema.js).

import { StyleSheet } from 'react-native';

export const coresClaro = {
  fundo: '#F4F7FA',
  superficie: '#FFFFFF',
  principal: '#1F3A5F', // azul-ardósia: cor da marca da loja
  botao: '#1F3A5F', // fundo dos botões (o texto do botão é sempre branco)
  botaoSecundario: '#5B6878', // botões como "Cancelar"
  texto: '#1B2430',
  textoSuave: '#5B6878',
  borda: '#D5DDE6',
  erro: '#B3261E',
  sucesso: '#1E7B4A',
  sucessoFundo: '#E3F4EA',
};

export const coresEscuro = {
  fundo: '#121821',
  superficie: '#1C2530',
  principal: '#8FB3E0', // azul claro: legível sobre o fundo escuro
  botao: '#3B6EA8', // mais escuro que o principal para o texto branco ficar legível
  botaoSecundario: '#4A5767',
  texto: '#E6EBF1',
  textoSuave: '#9AA7B6',
  borda: '#2E3A48',
  erro: '#F2B8B5',
  sucesso: '#7FD3A3',
  sucessoFundo: '#173A28',
};

export const criarEstilos = (cores) => StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 12 },
  titulo: { fontSize: 26, fontWeight: '700', color: cores.principal },
  subtitulo: { fontSize: 15, lineHeight: 22, color: cores.textoSuave },
  resumo: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginVertical: 8 },
  resumoNumero: { fontSize: 40, fontWeight: '700', color: cores.texto },
  resumoRotulo: { fontSize: 15, color: cores.textoSuave },
  vazio: { fontSize: 15, lineHeight: 22, color: cores.textoSuave, marginTop: 8 },
  itemProduto: {
    backgroundColor: cores.superficie,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: cores.principal,
    borderRadius: 6,
  },
  itemPressionado: { opacity: 0.6 },
  itemNome: { fontSize: 17, fontWeight: '600', color: cores.texto },
  itemDetalhe: { fontSize: 14, color: cores.textoSuave, marginTop: 2 },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginTop: 4 },
  campo: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: cores.texto,
  },
  erro: { color: cores.erro, fontSize: 14 },
  botoes: { gap: 10, marginTop: 8 },

  // Tela de detalhe
  detalheLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  detalheRotulo: { fontSize: 15, color: cores.textoSuave },
  detalheValor: { fontSize: 15, fontWeight: '600', color: cores.texto },

  // Tela de vendas: botões de escolha do produto
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcao: {
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  opcaoSelecionada: { backgroundColor: cores.principal, borderColor: cores.principal },
  opcaoTexto: { fontSize: 15, color: cores.texto },
  opcaoTextoSelecionado: { color: cores.superficie, fontWeight: '600' },

  // Faixa animada de confirmação da venda
  confirmacao: {
    backgroundColor: cores.sucessoFundo,
    borderLeftWidth: 4,
    borderLeftColor: cores.sucesso,
    borderRadius: 6,
    padding: 14,
  },
  confirmacaoTexto: { color: cores.sucesso, fontSize: 15, fontWeight: '600' },
});
