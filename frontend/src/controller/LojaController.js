// Controller — fica entre as telas (view) e os dados (model).
// As telas nunca mexem no model direto: chamam as funções daqui, que validam
// os dados, gravam no model e atualizam o estado para a tela redesenhar.
// Usamos o Context do próprio React para que todas as abas enxerguem os
// mesmos produtos e vendas (não é Redux, é recurso nativo do React).

import { createContext, useContext, useState } from 'react';
import { listarProdutos, criarProduto } from '../model/produtoModel';
import { listarVendas, criarVenda } from '../model/vendaModel';

const LojaContext = createContext(null);

// Converte o texto digitado em número; aceita "8,50" ou "8.50"
function textoParaNumero(texto) {
  return parseFloat(String(texto).replace(',', '.'));
}

export function LojaProvider({ children }) {
  const [produtos, setProdutos] = useState(listarProdutos());
  const [vendas, setVendas] = useState(listarVendas());

  // Recebe os textos do formulário e devolve { ok, erro }
  function adicionarProduto({ nome, preco, unidade }) {
    const precoNumero = textoParaNumero(preco);

    console.log('[Controller] Tentando salvar produto:', { nome, preco, precoNumero, unidade });

    if (nome.trim() === '') {
      return { ok: false, erro: 'Informe o nome do produto.' };
    }
    if (isNaN(precoNumero) || precoNumero <= 0) {
      return { ok: false, erro: 'Informe um preço maior que zero, por exemplo 8,50.' };
    }

    const produto = criarProduto({
      nome: nome.trim(),
      preco: precoNumero,
      unidade: unidade.trim() || 'unidade',
    });
    setProdutos(listarProdutos());
    return { ok: true, produto };
  }

  // Recebe o id do produto escolhido e a quantidade digitada; devolve { ok, erro }
  function registrarVenda(produtoId, quantidade) {
    const quantidadeNumero = textoParaNumero(quantidade);

    console.log('[Controller] Tentando registrar venda:', { produtoId, quantidade, quantidadeNumero });

    if (!produtoId) {
      return { ok: false, erro: 'Escolha um produto.' };
    }
    if (isNaN(quantidadeNumero) || quantidadeNumero <= 0) {
      return { ok: false, erro: 'Informe uma quantidade maior que zero.' };
    }

    const venda = criarVenda({ produtoId, quantidade: quantidadeNumero });
    setVendas(listarVendas());
    return { ok: true, venda };
  }

  function buscarProduto(id) {
    return produtos.find((p) => p.id === id);
  }

  // Soma das quantidades vendidas de um produto (usado na tela de detalhe)
  function totalVendido(produtoId) {
    return vendas
      .filter((v) => v.produtoId === produtoId)
      .reduce((soma, v) => soma + v.quantidade, 0);
  }

  const valor = { produtos, vendas, adicionarProduto, registrarVenda, buscarProduto, totalVendido };

  return <LojaContext.Provider value={valor}>{children}</LojaContext.Provider>;
}

// Atalho usado pelas telas: const { produtos } = useLoja();
export function useLoja() {
  return useContext(LojaContext);
}
