// Model de vendas — lê e grava as vendas na tabela "vendas" do SQLite.
// Mesmos nomes de função e formato da Etapa 2: { id, produtoId, quantidade, data }.
// Na Etapa 4 as vendas com sincronizado = 0 serão enviadas ao backend Python.

import * as Crypto from 'expo-crypto';
import { obterBanco } from './banco';

// Converte uma linha do banco no objeto usado pelo app
export function linhaParaVenda(linha) {
  return {
    id: linha.uuid,
    produtoId: String(linha.produto_id), // texto, igual ao id do produto no app
    quantidade: linha.quantidade,
    data: linha.data_hora,
  };
}

export async function listarVendas() {
  const banco = await obterBanco();
  const linhas = await banco.getAllAsync(
    'SELECT uuid, produto_id, quantidade, data_hora FROM vendas ORDER BY data_hora',
  );
  return linhas.map(linhaParaVenda);
}

export async function criarVenda({ produtoId, quantidade }) {
  const banco = await obterBanco();
  const linha = {
    uuid: Crypto.randomUUID(), // id único gerado no celular, sem depender do servidor
    produto_id: Number(produtoId), // no banco o id do produto é número
    quantidade,
    data_hora: new Date().toISOString(), // texto ISO em UTC, ex.: 2026-10-27T15:00:00.000Z
  };
  await banco.runAsync(
    'INSERT INTO vendas (uuid, produto_id, quantidade, data_hora, sincronizado) VALUES (?, ?, ?, ?, 0)',
    [linha.uuid, linha.produto_id, linha.quantidade, linha.data_hora],
  );
  const novaVenda = linhaParaVenda(linha);
  console.log('[Model] Venda criada:', novaVenda);
  return novaVenda;
}
