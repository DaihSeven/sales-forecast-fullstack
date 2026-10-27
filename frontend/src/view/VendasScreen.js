// Tela de registro de vendas: escolher o produto, digitar a quantidade e
// registrar. Ao confirmar, uma faixa verde aparece e some usando Animated.

import { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Pressable,
  Animated,
  useAnimatedValue,
} from 'react-native';
import { useLoja } from '../controller/LojaController';
import { useTema } from './tema';
import { formatarNumero } from './formatar';
import ErroCarregamento from './ErroCarregamento';

export default function VendasScreen() {
  const { produtos, vendas, carregando, erroCarregamento, registrarVenda } = useLoja();
  const { cores, estilos } = useTema();

  const [produtoId, setProdutoId] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Proteção contra toque duplo (mesma ideia do cadastro de produto):
  // o estado desabilita o botão; a ref barra toques no mesmo instante
  const [salvando, setSalvando] = useState(false);
  const travaSalvar = useRef(false);

  // Valores animados: useAnimatedValue cria o valor uma vez e mantém o mesmo
  // entre renderizações (substitui o useRef(new Animated.Value()).current)
  const opacidade = useAnimatedValue(0);
  const escala = useAnimatedValue(0.8);

  const produtoEscolhido = produtos.find((p) => p.id === produtoId);

  // Faixa aparece (fade + "pulo" de escala), espera 1,5 s e some
  function animarConfirmacao() {
    opacidade.setValue(0);
    escala.setValue(0.8);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacidade, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(escala, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.delay(1500),
      Animated.timing(opacidade, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }

  // async porque o controller grava no model (SQLite), que devolve Promise
  async function registrar() {
    if (travaSalvar.current) {
      console.log('[Vendas] Toque ignorado: gravação em andamento');
      return;
    }
    travaSalvar.current = true;
    setSalvando(true);

    try {
      const resultado = await registrarVenda(produtoId, quantidade);

      if (!resultado.ok) {
        console.log('[Vendas] Erro:', resultado.erro);
        setErro(resultado.erro);
        return;
      }

      console.log('[Vendas] Venda registrada:', resultado.venda);
      // Mostra a quantidade que foi gravada (já convertida), não o texto digitado
      const quantidadeGravada = formatarNumero(resultado.venda.quantidade);
      setMensagem(`Venda registrada: ${quantidadeGravada} ${produtoEscolhido.unidade} de ${produtoEscolhido.nome}`);
      setQuantidade('');
      animarConfirmacao();
    } finally {
      travaSalvar.current = false;
      setSalvando(false);
    }
  }

  console.log('[VendasScreen] Renderizando | produto escolhido:', produtoId, '| vendas:', vendas.length);

  // Se o banco não abriu, mostra o erro com o botão "Tentar novamente"
  if (erroCarregamento) {
    return (
      <View style={[estilos.raiz, estilos.conteudo]}>
        <ErroCarregamento />
      </View>
    );
  }

  // Enquanto o controller carrega os dados, mostra um aviso
  if (carregando) {
    return (
      <View style={[estilos.raiz, estilos.conteudo]}>
        <Text style={estilos.vazio}>Carregando…</Text>
      </View>
    );
  }

  // Sem produtos não há o que vender
  if (produtos.length === 0) {
    return (
      <View style={[estilos.raiz, estilos.conteudo]}>
        <Text style={estilos.vazio}>
          Cadastre um produto na aba Produtos para registrar vendas.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.raiz} keyboardShouldPersistTaps="handled">
      <View style={estilos.conteudo}>
        <Text style={estilos.rotulo}>Produto</Text>
        <View style={estilos.opcoes}>
          {produtos.map((p) => {
            const selecionado = p.id === produtoId;
            return (
              <Pressable
                key={p.id}
                style={[estilos.opcao, selecionado && estilos.opcaoSelecionada]}
                onPress={() => { setProdutoId(p.id); setErro(''); }}
              >
                <Text style={[estilos.opcaoTexto, selecionado && estilos.opcaoTextoSelecionado]}>
                  {p.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={estilos.rotulo}>
          Quantidade{produtoEscolhido ? ` (${produtoEscolhido.unidade})` : ''}
        </Text>
        <TextInput
          style={estilos.campo}
          value={quantidade}
          onChangeText={(t) => { setQuantidade(t); setErro(''); }}
          placeholder="Ex.: 10"
          keyboardType="decimal-pad"
        />

        {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

        <View style={estilos.botoes}>
          <Button
            title={salvando ? 'Salvando…' : 'Registrar venda'}
            color={cores.botao}
            onPress={registrar}
            disabled={salvando}
          />
        </View>

        {/* Faixa de confirmação animada (fica invisível com opacidade 0) */}
        <Animated.View
          style={[estilos.confirmacao, { opacity: opacidade, transform: [{ scale: escala }] }]}
        >
          <Text style={estilos.confirmacaoTexto}>✓ {mensagem}</Text>
        </Animated.View>

        <Text style={estilos.itemDetalhe}>Vendas registradas: {vendas.length}</Text>
      </View>
    </ScrollView>
  );
}
