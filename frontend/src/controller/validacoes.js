// Validações dos formulários — funções puras (não usam React nem o model),
// por isso podem ser testadas sozinhas com o Jest.
// Cada validação devolve { ok: false, erro } ou { ok: true, dados } com os
// valores já convertidos e prontos para gravar.

// Converte o texto digitado em número; aceita "8,50" ou "8.50".
// Usa Number() em vez de parseFloat para recusar textos como "10abc" ou
// "1.000,50" (parseFloat leria 10 e 1 sem avisar). Texto inválido vira NaN.
export function textoParaNumero(texto) {
  const limpo = String(texto).trim().replace(',', '.');
  if (limpo === '') {
    return NaN; // Number('') daria 0, e campo vazio não é zero
  }
  return Number(limpo);
}

export function validarProduto({ nome, preco, unidade }) {
  const precoNumero = textoParaNumero(preco);

  if (nome.trim() === '') {
    return { ok: false, erro: 'Informe o nome do produto.' };
  }
  if (isNaN(precoNumero) || precoNumero <= 0) {
    return { ok: false, erro: 'Informe um preço maior que zero, por exemplo 8,50.' };
  }

  return {
    ok: true,
    dados: {
      nome: nome.trim(),
      preco: precoNumero,
      unidade: unidade.trim() || 'unidade',
    },
  };
}

export function validarVenda(produtoId, quantidade) {
  const quantidadeNumero = textoParaNumero(quantidade);

  if (!produtoId) {
    return { ok: false, erro: 'Escolha um produto.' };
  }
  if (isNaN(quantidadeNumero) || quantidadeNumero <= 0) {
    return { ok: false, erro: 'Informe uma quantidade maior que zero.' };
  }

  return { ok: true, dados: { produtoId, quantidade: quantidadeNumero } };
}

// Preferências da tela de Configurações: nome da loja e tema
export function validarPreferencias({ nomeLoja, tema }) {
  if (typeof nomeLoja !== 'string' || nomeLoja.trim() === '') {
    return { ok: false, erro: 'Informe o nome da loja.' };
  }
  if (tema !== 'claro' && tema !== 'escuro') {
    return { ok: false, erro: 'Escolha o tema claro ou escuro.' };
  }
  return { ok: true, dados: { nomeLoja: nomeLoja.trim(), tema } };
}
