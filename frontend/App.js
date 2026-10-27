// Etapa 3 — Persistência local (Tema 3)
// Conceitos: SQLite (expo-sqlite) para produtos e vendas, AsyncStorage para
// as preferências (nome da loja e tema) e tema claro/escuro em todo o app.
// Este arquivo só monta a estrutura: os dois controllers (dados
// compartilhados) e o Tab Navigator com as quatro abas.

import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { LojaProvider } from './src/controller/LojaController';
import { PreferenciasProvider, usePreferencias } from './src/controller/PreferenciasController';
import ProdutosStack from './src/view/ProdutosStack';
import VendasScreen from './src/view/VendasScreen';
import PrevisaoScreen from './src/view/PrevisaoScreen';
import ConfiguracoesScreen from './src/view/ConfiguracoesScreen';
import { useTema } from './src/view/tema';

const Tab = createBottomTabNavigator();

// Ícone da aba feito com emoji, para não precisar de biblioteca de ícones
function icone(emoji) {
  return () => <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

// Navegação com as cores do tema escolhido. Fica num componente separado
// porque precisa ler as preferências, que só existem dentro dos Providers.
function Navegacao() {
  const { carregandoPreferencias } = usePreferencias();
  const { tema, cores } = useTema();

  // Espera as preferências (é bem rápido) para não piscar o tema errado
  if (carregandoPreferencias) {
    return null;
  }

  // Tema do React Navigation: fundo das telas, cabeçalhos e barra de abas
  const temaBase = tema === 'escuro' ? DarkTheme : DefaultTheme;
  const temaNavegacao = {
    ...temaBase,
    colors: {
      ...temaBase.colors,
      primary: cores.principal,
      background: cores.fundo,
      card: cores.superficie,
      text: cores.texto,
      border: cores.borda,
    },
  };

  return (
    <NavigationContainer
      theme={temaNavegacao}
      onStateChange={(estado) => console.log('[App] Aba atual:', estado.routes[estado.index].name)}
    >
      <StatusBar style={tema === 'escuro' ? 'light' : 'dark'} />
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
        <Tab.Screen
          name="Configuracoes"
          component={ConfiguracoesScreen}
          options={{ title: 'Configurações', tabBarIcon: icone('⚙️') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  console.log('[App] Iniciando');

  return (
    <SafeAreaProvider>
      <PreferenciasProvider>
        <LojaProvider>
          <Navegacao />
        </LojaProvider>
      </PreferenciasProvider>
    </SafeAreaProvider>
  );
}
