// Testa o SQL de criação das tabelas num SQLite de verdade: o que vem
// embutido no Node (node:sqlite, Node 22.13 ou mais novo). Assim dá para
// provar que a chave estrangeira funciona sem precisar do celular.
// Em versões antigas do Node estes testes são pulados.

import { SQL_CRIAR_TABELAS } from '../esquema';

let sqlite = null;
try {
  sqlite = require('node:sqlite');
} catch {
  console.log('[Teste] node:sqlite indisponível nesta versão do Node; testes pulados');
}
const testeComSqlite = sqlite ? test : test.skip;

// Cria um banco novo, só na memória, com as tabelas do app.
// O node:sqlite liga as chaves estrangeiras por padrão, mas o SQLite do
// celular não; desligamos aqui para ficar igual ao aparelho e provar que
// quem liga é o PRAGMA do nosso SQL.
function criarBancoDeTeste(sql = SQL_CRIAR_TABELAS) {
  const banco = new sqlite.DatabaseSync(':memory:', { enableForeignKeyConstraints: false });
  banco.exec(sql);
  return banco;
}

const SQL_INSERIR_VENDA =
  'INSERT INTO vendas (uuid, produto_id, quantidade, data_hora) VALUES (?, ?, ?, ?)';

describe('esquema do banco', () => {
  testeComSqlite('recusa venda de produto que não existe (foreign_keys ligado)', () => {
    const banco = criarBancoDeTeste();
    expect(() =>
      banco.prepare(SQL_INSERIR_VENDA).run('uuid-1', 999, 2, '2026-10-27T15:00:00.000Z'),
    ).toThrow(/FOREIGN KEY constraint failed/);
  });

  testeComSqlite('aceita venda de produto existente, com sincronizado = 0', () => {
    const banco = criarBancoDeTeste();
    const { lastInsertRowid } = banco
      .prepare('INSERT INTO produtos (nome, preco, unidade) VALUES (?, ?, ?)')
      .run('Pão francês', 0.75, 'unidade');

    banco.prepare(SQL_INSERIR_VENDA).run('uuid-1', lastInsertRowid, 10, '2026-10-27T15:00:00.000Z');

    const venda = banco.prepare('SELECT * FROM vendas').get();
    expect(venda.produto_id).toBe(Number(lastInsertRowid));
    expect(venda.sincronizado).toBe(0); // padrão: venda ainda não enviada
  });

  testeComSqlite('sem o PRAGMA a venda inválida passaria (por isso ele é necessário)', () => {
    const banco = criarBancoDeTeste(SQL_CRIAR_TABELAS.replace('PRAGMA foreign_keys = ON;', ''));
    expect(() =>
      banco.prepare(SQL_INSERIR_VENDA).run('uuid-1', 999, 2, '2026-10-27T15:00:00.000Z'),
    ).not.toThrow();
  });

  testeComSqlite('rodar o SQL duas vezes não dá erro (IF NOT EXISTS)', () => {
    const banco = criarBancoDeTeste();
    expect(() => banco.exec(SQL_CRIAR_TABELAS)).not.toThrow();
  });
});
