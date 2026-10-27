// Controller — fica entre as telas (view) e os dados (model).
// As telas nunca mexem no model direto: chamam as funções daqui, que validam
// os dados, gravam no model e atualizam o estado para a tela redesenhar.
// Usamos o Context do próprio React para que todas as abas enxerguem os
// mesmos produtos e vendas (não é Redux, é recurso nativo do React).
// As funções do model são assíncronas (preparadas para o SQLite), por isso
// usamos async/await e um estado "carregando" enquanto os dados chegam.

import { createContext, useContext, useEffect, useState } from 'react';
import { listarProdutos, criarProduto } from '../model/produtoModel';
import { listarVendas, criarVenda } from '../model/vendaModel';
import { validarProduto, validarVenda } from './validacoes';
import { totalVendido } from './calculos';

const LojaContext = createContext(null);

export function LojaProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carregamento inicial: roda uma vez só, quando o app abre ([] = sem dependências)
  useEffect(() => {
    async function carregarDados() {
      try {
        const [listaProdutos, listaVendas] = await Promise.all([listarProdutos(), listarVendas()]);
        setProdutos(listaProdutos);
        setVendas(listaVendas);
        console.log('[Controller] Dados carregados:', listaProdutos.length, 'produtos,', listaVendas.length, 'vendas');
      } catch (erro) {
        console.log('[Controller] Erro ao carregar dados:', erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  // Recebe os textos do formulário e devolve (via Promise) { ok, erro }
  async function adicionarProduto({ nome, preco, unidade }) {
    console.log('[Controller] Tentando salvar produto:', { nome, preco, unidade });

    const validacao = validarProduto({ nome, preco, unidade });
    if (!validacao.ok) {
      return validacao;
    }

    try {
      const produto = await criarProduto(validacao.dados);
      setProdutos(await listarProdutos());
      return { ok: true, produto };
    } catch (erro) {
      console.log('[Controller] Erro ao salvar produto:', erro);
      return { ok: false, erro: 'Não foi possível salvar o produto. Tente novamente.' };
    }
  }

  // Recebe o id do produto escolhido e a quantidade digitada; devolve (via Promise) { ok, erro }
  async function registrarVenda(produtoId, quantidade) {
    console.log('[Controller] Tentando registrar venda:', { produtoId, quantidade });

    const validacao = validarVenda(produtoId, quantidade);
    if (!validacao.ok) {
      return validacao;
    }

    try {
      const venda = await criarVenda(validacao.dados);
      setVendas(await listarVendas());
      return { ok: true, venda };
    } catch (erro) {
      console.log('[Controller] Erro ao registrar venda:', erro);
      return { ok: false, erro: 'Não foi possível registrar a venda. Tente novamente.' };
    }
  }

  function buscarProduto(id) {
    return produtos.find((p) => p.id === id);
  }

  // Soma das quantidades vendidas de um produto (usado na tela de detalhe)
  function totalVendidoDoProduto(produtoId) {
    return totalVendido(vendas, produtoId);
  }

  const valor = {
    produtos,
    vendas,
    carregando,
    adicionarProduto,
    registrarVenda,
    buscarProduto,
    totalVendido: totalVendidoDoProduto,
  };

  return <LojaContext.Provider value={valor}>{children}</LojaContext.Provider>;
}

// Atalho usado pelas telas: const { produtos } = useLoja();
export function useLoja() {
  return useContext(LojaContext);
}
