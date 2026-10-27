// Tela de lista de produtos (era a TelaInicial da Etapa 1).
// Agora usa FlatList, que só desenha os itens visíveis na tela —
// mais eficiente que o map quando a lista cresce.

import { View, Text, Button, FlatList, Pressable } from 'react-native';
import { useLoja } from '../controller/LojaController';
import { cores, estilos } from './estilos';

export default function ProdutosScreen({ navigation }) {
  const { produtos } = useLoja();

  console.log('[ProdutosScreen] Renderizando | total de produtos:', produtos.length);

  // Cabeçalho da lista: título, resumo e botão de cadastro
  const cabecalho = (
    <View style={{ gap: 12 }}>
      <Text style={estilos.titulo}>Padaria do Bairro</Text>
      <Text style={estilos.subtitulo}>
        Registre suas vendas e veja quanto deve vender na próxima semana.
      </Text>

      <View style={estilos.resumo}>
        <Text style={estilos.resumoNumero}>{produtos.length}</Text>
        <Text style={estilos.resumoRotulo}>
          {produtos.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
        </Text>
      </View>

      <Button
        title="Cadastrar produto"
        color={cores.principal}
        onPress={() => navigation.navigate('CadastroProduto')}
      />
    </View>
);

  // Como cada produto aparece na lista; ao tocar, abre o detalhe (Stack)
  function desenharProduto({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [estilos.itemProduto, pressed && estilos.itemPressionado]}
        onPress={() => {
          console.log('[ProdutosScreen] Abrindo detalhe do produto:', item.id);
          navigation.navigate('DetalheProduto', { produtoId: item.id });
        }}
      >
        <Text style={estilos.itemNome}>{item.nome}</Text>
        <Text style={estilos.itemDetalhe}>
          R$ {item.preco.toFixed(2).replace('.', ',')} por {item.unidade}
        </Text>
      </Pressable>
    );
  }

  return (
    <FlatList
      style={estilos.raiz}
      contentContainerStyle={estilos.conteudo}
      data={produtos}
      keyExtractor={(item) => item.id}
      renderItem={desenharProduto}
      ListHeaderComponent={cabecalho}
      // Mensagem mostrada quando a lista está vazia
      ListEmptyComponent={
        <Text style={estilos.vazio}>
          Nenhum produto ainda. Cadastre o primeiro para começar a registrar vendas.
        </Text>
      }
    />
  );
}
