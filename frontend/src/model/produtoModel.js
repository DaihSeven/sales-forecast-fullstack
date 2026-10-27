// Model de produtos — guarda os dados dos produtos.
// Por enquanto tudo fica em memória (some ao fechar o app); na Etapa 3
// estas mesmas funções passam a ler e gravar no SQLite.
// As funções já são async (devolvem Promise) porque as do SQLite também
// serão; assim o controller e as telas não precisam mudar na Etapa 3.

let produtos = [];

// Devolve uma cópia da lista, para ninguém alterar o array original por fora
export async function listarProdutos() {
  return [...produtos];
}

export async function criarProduto({ nome, preco, unidade }) {
  const novoProduto = {
    id: Date.now().toString(), // provisório; na Etapa 3 o SQLite gera o id
    nome,
    preco,
    unidade,
  };
  produtos.push(novoProduto);
  console.log('[Model] Produto criado:', novoProduto, '| total:', produtos.length);
  return novoProduto;
}
