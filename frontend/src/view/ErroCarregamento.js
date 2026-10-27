// Aviso mostrado quando o banco não abre no carregamento inicial,
// com um botão para tentar de novo. Usado nas telas de Produtos e Vendas.

import { View, Text, Button } from 'react-native';
import { useLoja } from '../controller/LojaController';
import { useTema } from './tema';

export default function ErroCarregamento() {
  const { erroCarregamento, tentarNovamente } = useLoja();
  const { cores, estilos } = useTema();

  return (
    <View style={{ gap: 12 }}>
      <Text style={estilos.erro}>{erroCarregamento}</Text>
      <Button title="Tentar novamente" color={cores.botao} onPress={tentarNovamente} />
    </View>
  );
}
