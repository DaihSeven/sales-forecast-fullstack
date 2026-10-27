// Formulário de cadastro de produto.
// A validação agora fica no controller; a tela só mostra o erro devolvido.

import { useRef, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { useLoja } from '../controller/LojaController';
import { useTema } from './tema';

export default function CadastroProdutoScreen({ navigation }) {
  const { adicionarProduto } = useLoja();
  const { cores, estilos } = useTema();

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [unidade, setUnidade] = useState('unidade');
  const [erro, setErro] = useState('');

  // Proteção contra toque duplo:
  // - salvando (estado) desabilita o botão e troca o texto na tela;
  // - travaSalvar (ref) muda na hora, sem esperar a tela redesenhar, então
  //   dois toques no mesmo instante não gravam duas vezes.
  const [salvando, setSalvando] = useState(false);
  const travaSalvar = useRef(false);

  // async porque o controller grava no model (SQLite), que devolve Promise
  async function salvar() {
    if (travaSalvar.current) {
      console.log('[Cadastro] Toque ignorado: gravação em andamento');
      return;
    }
    travaSalvar.current = true;
    setSalvando(true);

    try {
      const resultado = await adicionarProduto({ nome, preco, unidade });

      if (!resultado.ok) {
        console.log('[Cadastro] Erro:', resultado.erro);
        setErro(resultado.erro);
        return;
      }

      console.log('[Cadastro] Produto salvo:', resultado.produto);
      Alert.alert('Produto salvo', `${resultado.produto.nome} foi cadastrado.`);
      navigation.goBack(); // volta para a lista (Stack)
    } finally {
      travaSalvar.current = false;
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={estilos.raiz} keyboardShouldPersistTaps="handled">
      <View style={estilos.conteudo}>
        <Text style={estilos.rotulo}>Nome</Text>
        <TextInput
          style={estilos.campo}
          value={nome}
          onChangeText={(t) => { setNome(t); setErro(''); }}
          placeholder="Ex.: Pão francês"
        />

        <Text style={estilos.rotulo}>Preço (R$)</Text>
        <TextInput
          style={estilos.campo}
          value={preco}
          onChangeText={(t) => { setPreco(t); setErro(''); }}
          placeholder="Ex.: 0,75"
          keyboardType="decimal-pad"
        />

        <Text style={estilos.rotulo}>Vendido por</Text>
        <TextInput
          style={estilos.campo}
          value={unidade}
          onChangeText={setUnidade}
          placeholder="unidade, kg, pacote…"
        />

        {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

        <View style={estilos.botoes}>
          <Button
            title={salvando ? 'Salvando…' : 'Salvar produto'}
            color={cores.botao}
            onPress={salvar}
            disabled={salvando}
          />
          <Button
            title="Cancelar"
            color={cores.botaoSecundario}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </ScrollView>
  );
}
