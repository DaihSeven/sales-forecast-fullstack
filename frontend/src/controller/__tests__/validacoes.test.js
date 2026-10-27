// Testes das validações dos formulários (rodar com: npm test)

import { textoParaNumero, validarProduto, validarVenda } from '../validacoes';

describe('textoParaNumero', () => {
  test('aceita vírgula como separador decimal', () => {
    expect(textoParaNumero('8,50')).toBe(8.5);
  });

  test('aceita ponto como separador decimal', () => {
    expect(textoParaNumero('8.50')).toBe(8.5);
  });

  test('recusa texto com letras (parseFloat leria 10)', () => {
    expect(textoParaNumero('10abc')).toBeNaN();
  });

  test('campo vazio vira NaN, não zero', () => {
    expect(textoParaNumero('')).toBeNaN();
  });

  test('converte "0" para zero (quem recusa é a validação)', () => {
    expect(textoParaNumero('0')).toBe(0);
  });

  test('converte "-5" para negativo (quem recusa é a validação)', () => {
    expect(textoParaNumero('-5')).toBe(-5);
  });

  test('recusa separador de milhar "1.000,50" (parseFloat leria 1)', () => {
    expect(textoParaNumero('1.000,50')).toBeNaN();
  });
});

describe('validarProduto', () => {
  test('produto válido devolve os dados convertidos', () => {
    const resultado = validarProduto({ nome: '  Pão francês ', preco: '0,75', unidade: 'unidade' });
    expect(resultado).toEqual({
      ok: true,
      dados: { nome: 'Pão francês', preco: 0.75, unidade: 'unidade' },
    });
  });

  test('unidade vazia vira "unidade"', () => {
    const resultado = validarProduto({ nome: 'Queijo', preco: '45,90', unidade: '   ' });
    expect(resultado.dados.unidade).toBe('unidade');
  });

  test('recusa nome vazio', () => {
    const resultado = validarProduto({ nome: '  ', preco: '8,50', unidade: 'kg' });
    expect(resultado).toEqual({ ok: false, erro: 'Informe o nome do produto.' });
  });

  test.each(['0', '-5', '', '10abc'])('recusa preço "%s"', (preco) => {
    const resultado = validarProduto({ nome: 'Bolo', preco, unidade: 'unidade' });
    expect(resultado.ok).toBe(false);
    expect(resultado.erro).toMatch(/preço maior que zero/);
  });
});

describe('validarVenda', () => {
  test('venda válida devolve a quantidade convertida', () => {
    expect(validarVenda('123', '1,5')).toEqual({
      ok: true,
      dados: { produtoId: '123', quantidade: 1.5 },
    });
  });

  test('recusa venda sem produto escolhido', () => {
    expect(validarVenda(null, '10')).toEqual({ ok: false, erro: 'Escolha um produto.' });
  });

  test.each(['0', '-5', '', '10abc'])('recusa quantidade "%s"', (quantidade) => {
    expect(validarVenda('123', quantidade)).toEqual({
      ok: false,
      erro: 'Informe uma quantidade maior que zero.',
    });
  });
});
