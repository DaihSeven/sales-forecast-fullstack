// Esquema do banco SQLite: comandos que criam as tabelas.
// Fica num arquivo separado, sem nenhum import, para o mesmo SQL poder ser
// testado no Jest com o SQLite do Node (ver __tests__/esquema.test.js).

export const SQL_CRIAR_TABELAS = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    unidade TEXT NOT NULL
  );

  -- uuid e sincronizado já ficam prontos para a Etapa 4 (Offline First):
  -- o uuid identifica a venda também no servidor, e sincronizado = 0 marca
  -- as vendas que ainda não foram enviadas.
  CREATE TABLE IF NOT EXISTS vendas (
    uuid TEXT PRIMARY KEY NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade REAL NOT NULL,
    data_hora TEXT NOT NULL,
    sincronizado INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (produto_id) REFERENCES produtos (id)
  );
`;
