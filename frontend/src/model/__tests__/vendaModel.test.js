// Testa o model de vendas com o banco e o expo-crypto trocados por falsos,
// e com o relógio parado num horário conhecido.

import { obterBanco } from '../banco';
import { linhaParaVenda, listarVendas, criarVenda } from '../vendaModel';

jest.mock('../banco', () => ({ obterBanco: jest.fn() }));
jest.mock('expo-crypto', () => ({ randomUUID: jest.fn(() => 'uuid-de-teste') }));

let banco;

beforeEach(() => {
  banco = { getAllAsync: jest.fn(), runAsync: jest.fn().mockResolvedValue({ changes: 1 }) };
  obterBanco.mockResolvedValue(banco);
  // Horário de Brasília 12:30 = 15:30 em UTC
  jest.useFakeTimers({ now: new Date('2026-10-27T12:30:00-03:00') });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('linhaParaVenda', () => {
  test('converte os nomes das colunas para os nomes usados no app', () => {
    expect(
      linhaParaVenda({
        uuid: 'abc',
        produto_id: 3,
        quantidade: 1.5,
        data_hora: '2026-10-27T15:30:00.000Z',
      }),
    ).toEqual({ id: 'abc', produtoId: '3', quantidade: 1.5, data: '2026-10-27T15:30:00.000Z' });
  });
});

describe('listarVendas', () => {
  test('lê da tabela vendas e converte cada linha', async () => {
    banco.getAllAsync.mockResolvedValue([
      { uuid: 'a', produto_id: 1, quantidade: 10, data_hora: '2026-10-27T15:00:00.000Z' },
    ]);

    const vendas = await listarVendas();

    expect(banco.getAllAsync.mock.calls[0][0]).toMatch(/FROM vendas/);
    expect(vendas).toEqual([
      { id: 'a', produtoId: '1', quantidade: 10, data: '2026-10-27T15:00:00.000Z' },
    ]);
  });
});

describe('criarVenda', () => {
  test('grava com uuid, produto_id numérico, data em UTC e sincronizado = 0', async () => {
    const venda = await criarVenda({ produtoId: '3', quantidade: 2 });

    const [sql, parametros] = banco.runAsync.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO vendas/);
    expect(sql).toMatch(/sincronizado\) VALUES \(\?, \?, \?, \?, 0\)/);
    expect(parametros).toEqual(['uuid-de-teste', 3, 2, '2026-10-27T15:30:00.000Z']);
    expect(venda).toEqual({
      id: 'uuid-de-teste',
      produtoId: '3',
      quantidade: 2,
      data: '2026-10-27T15:30:00.000Z',
    });
  });
});
