// Cálculos sobre as vendas — funções puras, testadas com o Jest.

// Soma das quantidades vendidas de um produto
export function totalVendido(vendas, produtoId) {
  return vendas
    .filter((v) => v.produtoId === produtoId)
    .reduce((soma, v) => soma + v.quantidade, 0);
}
