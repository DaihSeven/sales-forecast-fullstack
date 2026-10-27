// Testa a abertura do banco com o expo-sqlite trocado por um falso:
// abre uma vez só, liga as tabelas e permite tentar de novo após uma falha.

jest.mock('expo-sqlite', () => ({ openDatabaseAsync: jest.fn() }));

// banco.js guarda a conexão numa variável do módulo; para cada teste começar
// do zero, recarregamos os módulos e pegamos as versões novas
let SQLite;
let obterBanco;

beforeEach(() => {
  jest.resetModules();
  SQLite = require('expo-sqlite');
  obterBanco = require('../banco').obterBanco;
});

function bancoFalso() {
  return { execAsync: jest.fn().mockResolvedValue(undefined) };
}

describe('obterBanco', () => {
  test('abre o banco e cria as tabelas com foreign_keys ligado', async () => {
    const banco = bancoFalso();
    SQLite.openDatabaseAsync.mockResolvedValue(banco);

    await expect(obterBanco()).resolves.toBe(banco);
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('loja.db');
    expect(banco.execAsync.mock.calls[0][0]).toMatch(/PRAGMA foreign_keys = ON/);
  });

  test('abre uma vez só, mesmo com várias chamadas', async () => {
    SQLite.openDatabaseAsync.mockResolvedValue(bancoFalso());

    await Promise.all([obterBanco(), obterBanco(), obterBanco()]);
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
  });

  test('se a abertura falhar, a próxima chamada tenta de novo', async () => {
    const banco = bancoFalso();
    SQLite.openDatabaseAsync
      .mockRejectedValueOnce(new Error('disco cheio'))
      .mockResolvedValueOnce(banco);

    await expect(obterBanco()).rejects.toThrow('disco cheio');
    await expect(obterBanco()).resolves.toBe(banco);
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(2);
  });
});
