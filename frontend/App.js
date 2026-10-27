// Etapa 2 — Interface e navegação (Tema 2)
// Conceitos: organização MVC (src/model, src/controller, src/view),
// Bottom Tab Navigator, Stack Navigator, FlatList e Animated.
// Este arquivo só monta a estrutura: o controller (dados compartilhados)
// e o Tab Navigator com as três abas.

import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { LojaProvider } from './src/controller/LojaController';
import ProdutosStack from './src/view/ProdutosStack';
import VendasScreen from './src/view/VendasScreen';
import PrevisaoScreen from './src/view/PrevisaoScreen';
import { cores } from './src/view/estilos';

const Tab = createBottomTabNavigator();

// Ícone da aba feito com emoji, para não precisar de biblioteca de ícones
function icone(emoji) {
  return () => <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function App() {
  console.log('[App] Iniciando navegação');

  return (
    <SafeAreaProvider>
      <LojaProvider>
        <NavigationContainer
          onStateChange={(estado) =>
            console.log('[App] Aba atual:', estado.routes[estado.index].name)
          }
        >
          <StatusBar style="dark" />
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: cores.principal,
              tabBarInactiveTintColor: cores.textoSuave,
              headerTintColor: cores.principal,
            }}
          >
            {/* A aba Produtos tem o próprio Stack, com cabeçalho próprio */}
            <Tab.Screen
              name="Produtos"
              component={ProdutosStack}
              options={{ headerShown: false, tabBarIcon: icone('🥖') }}
            />
            <Tab.Screen
              name="Vendas"
              component={VendasScreen}
              options={{ title: 'Registrar venda', tabBarLabel: 'Vendas', tabBarIcon: icone('🧾') }}
            />
            <Tab.Screen
              name="Previsao"
              component={PrevisaoScreen}
              options={{ title: 'Previsão', tabBarIcon: icone('📈') }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </LojaProvider>
    </SafeAreaProvider>
  );
}
