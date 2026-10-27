// Funções de formatação de números para mostrar na tela (padrão brasileiro,
// com vírgula). São funções puras, testadas com o Jest.

// 8.5 -> "R$ 8,50"
export function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Quantidades com até 3 casas decimais, sem zeros sobrando:
// 10 -> "10", 1.5 -> "1,5", 0.1 + 0.2 -> "0,3" (e não "0,30000000000000004")
export function formatarNumero(valor) {
  return String(Number(valor.toFixed(3))).replace('.', ',');
}
