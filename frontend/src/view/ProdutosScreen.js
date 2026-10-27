// Tela de lista de produtos (era a TelaInicial da Etapa 1).
// Agora usa FlatList, que só desenha os itens visíveis na tela —
// mais eficiente que o map quando a lista cresce.

import { View, Text, Button, FlatList, Pressable } from 'react-native';
import { useLoja } from '../controller/LojaController';
import { usePreferencias } from '../controller/PreferenciasController';
import { useTema } from './tema';
import { formatarPreco } from './formatar';
import ErroCarregamento from './ErroCarregamento';

export default function ProdutosScreen({ navigation }) {
  const { produtos, carregando, erroCarregamento } = useLoja();
  const { nomeLoja } = usePreferencias(); // nome salvo na tela de Configurações
  const { cores, estilos } = useTema();

  console.log('[ProdutosScreen] Renderizando | total de produtos:', produtos.length);

  // Cabeçalho da lista: título, resumo e botão de cadastro
  const cabecalho = (
    <View style={{ gap: 12 }}>
      <Text style={estilos.titulo}>{nomeLoja}</Text>
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
        color={cores.botao}
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
          {formatarPreco(item.preco)} por {item.unidade}
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
      // Mensagem mostrada quando a lista está vazia (ou carregando, ou com erro)
      ListEmptyComponent={
        erroCarregamento ? (
          <ErroCarregamento />
        ) : (
          <Text style={estilos.vazio}>
            {carregando
              ? 'Carregando…'
              : 'Nenhum produto ainda. Cadastre o primeiro para começar a registrar vendas.'}
          </Text>
        )
      }
    />
  );
}
