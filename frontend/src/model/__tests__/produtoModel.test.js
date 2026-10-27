// Testa o model de produtos com o banco trocado por um falso
// (só conferimos o SQL enviado e a conversão das linhas).

import { obterBanco } from '../banco';
import { linhaParaProduto, listarProdutos, criarProduto } from '../produtoModel';

jest.mock('../banco', () => ({ obterBanco: jest.fn() }));

let banco;

beforeEach(() => {
  banco = { getAllAsync: jest.fn(), runAsync: jest.fn() };
  obterBanco.mockResolvedValue(banco);
});

describe('linhaParaProduto', () => {
  test('converte o id numérico do banco em texto', () => {
    expect(linhaParaProduto({ id: 7, nome: 'Queijo', preco: 45.9, unidade: 'kg' })).toEqual({
      id: '7',
      nome: 'Queijo',
      preco: 45.9,
      unidade: 'kg',
    });
  });
});

describe('listarProdutos', () => {
  test('lê da tabela produtos e converte cada linha', async () => {
    banco.getAllAsync.mockResolvedValue([
      { id: 1, nome: 'Pão francês', preco: 0.75, unidade: 'unidade' },
      { id: 2, nome: 'Queijo', preco: 45.9, unidade: 'kg' },
    ]);

    const produtos = await listarProdutos();

    expect(banco.getAllAsync.mock.calls[0][0]).toMatch(/FROM produtos/);
    expect(produtos.map((p) => p.id)).toEqual(['1', '2']);
  });
});

describe('criarProduto', () => {
  test('grava com INSERT e devolve o id gerado pelo SQLite', async () => {
    banco.runAsync.mockResolvedValue({ lastInsertRowId: 7, changes: 1 });

    const produto = await criarProduto({ nome: 'Queijo', preco: 45.9, unidade: 'kg' });

    const [sql, parametros] = banco.runAsync.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO produtos/);
    expect(parametros).toEqual(['Queijo', 45.9, 'kg']);
    expect(produto).toEqual({ id: '7', nome: 'Queijo', preco: 45.9, unidade: 'kg' });
  });
});
