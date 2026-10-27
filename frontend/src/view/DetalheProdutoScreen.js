// Tela de detalhe de um produto, aberta pelo Stack Navigator ao tocar na lista.
// Recebe o id do produto pelos parâmetros da rota (route.params).

import { View, Text, ScrollView } from 'react-native';
import { useLoja } from '../controller/LojaController';
import { estilos } from './estilos';

export default function DetalheProdutoScreen({ route }) {
  const { produtoId } = route.params;
  const { buscarProduto, totalVendido } = useLoja();
  const produto = buscarProduto(produtoId);

  console.log('[DetalheProduto] Abrindo produto:', produtoId, produto);

  if (!produto) {
    return (
      <View style={[estilos.raiz, estilos.conteudo]}>
        <Text style={estilos.vazio}>Produto não encontrado.</Text>
      </View>
    );
  }

  const vendido = totalVendido(produto.id);

  return (
    <ScrollView style={estilos.raiz} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.titulo}>{produto.nome}</Text>

      <View>
        <View style={estilos.detalheLinha}>
          <Text style={estilos.detalheRotulo}>Preço</Text>
          <Text style={estilos.detalheValor}>
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <View style={estilos.detalheLinha}>
          <Text style={estilos.detalheRotulo}>Vendido por</Text>
          <Text style={estilos.detalheValor}>{produto.unidade}</Text>
        </View>
        <View style={estilos.detalheLinha}>
          <Text style={estilos.detalheRotulo}>Total vendido</Text>
          <Text style={estilos.detalheValor}>
            {String(vendido).replace('.', ',')} {produto.unidade}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
