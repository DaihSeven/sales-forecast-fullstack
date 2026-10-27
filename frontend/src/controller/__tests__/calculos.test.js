// Testes dos cálculos sobre as vendas (rodar com: npm test)

import { totalVendido } from '../calculos';

const vendas = [
  { id: '1', produtoId: 'pao', quantidade: 10 },
  { id: '2', produtoId: 'queijo', quantidade: 0.1 },
  { id: '3', produtoId: 'pao', quantidade: 5 },
  { id: '4', produtoId: 'queijo', quantidade: 0.2 },
];

describe('totalVendido', () => {
  test('soma só as vendas do produto pedido', () => {
    expect(totalVendido(vendas, 'pao')).toBe(15);
  });

  test('soma quantidades decimais', () => {
    // toBeCloseTo porque 0,1 + 0,2 não dá exatamente 0,3 em JavaScript;
    // quem arredonda para mostrar na tela é o formatarNumero
    expect(totalVendido(vendas, 'queijo')).toBeCloseTo(0.3);
  });

  test('produto sem vendas dá zero', () => {
    expect(totalVendido(vendas, 'bolo')).toBe(0);
  });

  test('lista de vendas vazia dá zero', () => {
    expect(totalVendido([], 'pao')).toBe(0);
  });
});
