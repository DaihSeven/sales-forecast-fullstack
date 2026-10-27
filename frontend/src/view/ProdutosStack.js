// Stack Navigator da aba Produtos: as telas ficam "empilhadas".
// Lista -> Detalhe do produto, e Lista -> Cadastro. O botão voltar desempilha.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProdutosScreen from './ProdutosScreen';
import DetalheProdutoScreen from './DetalheProdutoScreen';
import CadastroProdutoScreen from './CadastroProdutoScreen';
import { useTema } from './tema';

const Stack = createNativeStackNavigator();

export default function ProdutosStack() {
  const { cores } = useTema();
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: cores.principal }}>
      <Stack.Screen name="ListaProdutos" component={ProdutosScreen} options={{ title: 'Produtos' }} />
      <Stack.Screen name="DetalheProduto" component={DetalheProdutoScreen} options={{ title: 'Detalhe do produto' }} />
      <Stack.Screen name="CadastroProduto" component={CadastroProdutoScreen} options={{ title: 'Novo produto' }} />
    </Stack.Navigator>
  );
}
