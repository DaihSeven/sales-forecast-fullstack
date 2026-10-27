// Controller de preferências — liga a tela de Configurações ao
// preferenciasModel (AsyncStorage). Fica separado do LojaController porque
// cuida de outro assunto: aparência do app, e não produtos e vendas.

import { createContext, useContext, useEffect, useState } from 'react';
import {
  lerPreferencias,
  salvarPreferencias as gravarPreferencias,
  PREFERENCIAS_PADRAO,
} from '../model/preferenciasModel';
import { validarPreferencias } from './validacoes';

const PreferenciasContext = createContext(null);

export function PreferenciasProvider({ children }) {
  const [nomeLoja, setNomeLoja] = useState(PREFERENCIAS_PADRAO.nomeLoja);
  const [tema, setTema] = useState(PREFERENCIAS_PADRAO.tema);
  const [carregandoPreferencias, setCarregandoPreferencias] = useState(true);

  // Lê as preferências salvas quando o app abre
  useEffect(() => {
    async function carregarPreferencias() {
      try {
        const lidas = await lerPreferencias();
        // Se o que estava salvo for inválido, fica com o padrão
        const validacao = validarPreferencias(lidas);
        const preferencias = validacao.ok ? validacao.dados : PREFERENCIAS_PADRAO;
        setNomeLoja(preferencias.nomeLoja);
        setTema(preferencias.tema);
        console.log('[Preferencias] Carregadas:', preferencias);
      } catch (erro) {
        console.log('[Preferencias] Erro ao carregar, usando o padrão:', erro);
      } finally {
        setCarregandoPreferencias(false);
      }
    }
    carregarPreferencias();
  }, []);

  // Recebe os valores da tela e devolve (via Promise) { ok, erro }
  async function salvarPreferencias({ nomeLoja: novoNome, tema: novoTema }) {
    console.log('[Preferencias] Tentando salvar:', { novoNome, novoTema });

    const validacao = validarPreferencias({ nomeLoja: novoNome, tema: novoTema });
    if (!validacao.ok) {
      return validacao;
    }

    try {
      await gravarPreferencias(validacao.dados);
      setNomeLoja(validacao.dados.nomeLoja);
      setTema(validacao.dados.tema);
      return { ok: true };
    } catch (erro) {
      console.log('[Preferencias] Erro ao salvar:', erro);
      return { ok: false, erro: 'Não foi possível salvar as preferências. Tente novamente.' };
    }
  }

  const valor = { nomeLoja, tema, carregandoPreferencias, salvarPreferencias };

  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>;
}

// Atalho usado pelas telas: const { nomeLoja } = usePreferencias();
export function usePreferencias() {
  return useContext(PreferenciasContext);
}
