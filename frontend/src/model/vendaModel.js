// Model de vendas — guarda cada venda registrada.
// Em memória por enquanto; na Etapa 3 vai para o SQLite e, depois, estes
// dados serão enviados ao backend Python para calcular a previsão.

let vendas = [];

export function listarVendas() {
  return [...vendas];
}

export function criarVenda({ produtoId, quantidade }) {
  const novaVenda = {
    id: Date.now().toString(),
    produtoId,
    quantidade,
    data: new Date().toISOString(), // data e hora da venda, útil para a previsão
  };
  vendas.push(novaVenda);
  console.log('[Model] Venda criada:', novaVenda, '| total:', vendas.length);
  return novaVenda;
}
