// Formulário de cadastro de produto.
// A validação agora fica no controller; a tela só mostra o erro devolvido.

import { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { useLoja } from '../controller/LojaController';
import { cores, estilos } from './estilos';

export default function CadastroProdutoScreen({ navigation }) {
  const { adicionarProduto } = useLoja();

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [unidade, setUnidade] = useState('unidade');
  const [erro, setErro] = useState('');

  function salvar() {
    const resultado = adicionarProduto({ nome, preco, unidade });

    if (!resultado.ok) {
      console.log('[Cadastro] Erro de validação:', resultado.erro);
      setErro(resultado.erro);
      return;
    }

    console.log('[Cadastro] Produto salvo:', resultado.produto);
    Alert.alert('Produto salvo', `${resultado.produto.nome} foi cadastrado.`);
    navigation.goBack(); // volta para a lista (Stack)
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
          <Button title="Salvar produto" color={cores.principal} onPress={salvar} />
          <Button title="Cancelar" color={cores.textoSuave} onPress={() => navigation.goBack()} />
        </View>
      </View>
    </ScrollView>
  );
}
