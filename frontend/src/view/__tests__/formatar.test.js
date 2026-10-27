// Testes da formatação de números para a tela (rodar com: npm test)

import { formatarPreco, formatarNumero } from '../formatar';

describe('formatarPreco', () => {
  test('usa vírgula e duas casas decimais', () => {
    expect(formatarPreco(8.5)).toBe('R$ 8,50');
  });

  test('preço inteiro ganha ",00"', () => {
    expect(formatarPreco(12)).toBe('R$ 12,00');
  });

  test('arredonda para duas casas', () => {
    expect(formatarPreco(0.756)).toBe('R$ 0,76');
  });
});

describe('formatarNumero', () => {
  test('número inteiro sem casas decimais', () => {
    expect(formatarNumero(10)).toBe('10');
  });

  test('decimal com vírgula', () => {
    expect(formatarNumero(1.5)).toBe('1,5');
  });

  test('corrige o erro de soma 0,1 + 0,2', () => {
    expect(formatarNumero(0.1 + 0.2)).toBe('0,3');
  });

  test('limita a três casas decimais', () => {
    expect(formatarNumero(1.23456)).toBe('1,235');
  });
});
