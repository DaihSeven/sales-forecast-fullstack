// Tela de previsão — placeholder.
// Nas próximas etapas ela vai buscar no backend Python (FastAPI) a previsão
// de demanda da próxima semana para cada produto.

import { View, Text } from 'react-native';
import { estilos } from './estilos';

export default function PrevisaoScreen() {
  console.log('[PrevisaoScreen] Renderizando placeholder');

  return (
    <View style={[estilos.raiz, estilos.conteudo]}>
      <Text style={estilos.titulo}>Previsão da semana</Text>
      <Text style={estilos.subtitulo}>
        Em breve: a previsão de quanto vender de cada produto na próxima semana,
        calculada pelo backend em Python a partir das vendas registradas.
      </Text>
    </View>
  );
}
