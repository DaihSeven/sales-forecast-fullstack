// Conexão com o banco SQLite (expo-sqlite, funções assíncronas).
// O banco é aberto uma vez só: a primeira chamada de obterBanco() abre e cria
// as tabelas; as seguintes reaproveitam a mesma Promise.

import * as SQLite from 'expo-sqlite';
import { SQL_CRIAR_TABELAS } from './esquema';

const NOME_BANCO = 'loja.db';

let promessaBanco = null; // guarda a abertura em andamento ou já concluída

async function abrirBanco() {
  const banco = await SQLite.openDatabaseAsync(NOME_BANCO);
  await banco.execAsync(SQL_CRIAR_TABELAS); // liga foreign_keys e cria as tabelas
  console.log('[Banco] Banco aberto e tabelas prontas:', NOME_BANCO);
  return banco;
}

export function obterBanco() {
  if (!promessaBanco) {
    promessaBanco = abrirBanco().catch((erro) => {
      console.log('[Banco] Erro ao abrir o banco:', erro);
      promessaBanco = null; // esquece a falha para a próxima chamada tentar de novo
      throw erro;
    });
  }
  return promessaBanco;
}
