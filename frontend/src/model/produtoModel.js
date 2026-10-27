// Model de produtos — lê e grava os produtos na tabela "produtos" do SQLite.
// Os nomes das funções e o formato devolvido são os mesmos da Etapa 2,
// por isso o controller e as telas não precisaram mudar.

import { obterBanco } from './banco';

// Converte uma linha do banco no objeto usado pelo app.
// O id é número no banco, mas o app sempre usou texto (keyExtractor,
// parâmetros de navegação), então convertemos aqui.
export function linhaParaProduto(linha) {
  return {
    id: String(linha.id),
    nome: linha.nome,
    preco: linha.preco,
    unidade: linha.unidade,
  };
}

export async function listarProdutos() {
  const banco = await obterBanco();
  const linhas = await banco.getAllAsync(
    'SELECT id, nome, preco, unidade FROM produtos ORDER BY id',
  );
  return linhas.map(linhaParaProduto);
}

export async function criarProduto({ nome, preco, unidade }) {
  const banco = await obterBanco();
  const resultado = await banco.runAsync(
    'INSERT INTO produtos (nome, preco, unidade) VALUES (?, ?, ?)',
    [nome, preco, unidade],
  );
  // O SQLite gera o id (AUTOINCREMENT) e devolve em lastInsertRowId
  const novoProduto = linhaParaProduto({ id: resultado.lastInsertRowId, nome, preco, unidade });
  console.log('[Model] Produto criado:', novoProduto);
  return novoProduto;
}
