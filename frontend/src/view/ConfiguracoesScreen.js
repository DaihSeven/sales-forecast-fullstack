// Tela de Configurações: nome da loja e tema (claro ou escuro).
// As escolhas só valem depois de tocar em "Salvar"; ficam guardadas no
// AsyncStorage e voltam quando o app é aberto de novo.

import { useRef, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Pressable, Alert } from 'react-native';
import { usePreferencias } from '../controller/PreferenciasController';
import { useTema } from './tema';

const OPCOES_TEMA = [
  { valor: 'claro', rotulo: 'Claro' },
  { valor: 'escuro', rotulo: 'Escuro' },
];

export default function ConfiguracoesScreen() {
  const preferencias = usePreferencias();
  const { cores, estilos } = useTema();

  // Começa com os valores salvos; o App só mostra as telas depois que as
  // preferências terminaram de carregar, então eles já estão prontos aqui
  const [nomeLoja, setNomeLoja] = useState(preferencias.nomeLoja);
  const [tema, setTema] = useState(preferencias.tema);
  const [erro, setErro] = useState('');

  // Proteção contra toque duplo, como no cadastro de produto
  const [salvando, setSalvando] = useState(false);
  const travaSalvar = useRef(false);

  async function salvar() {
    if (travaSalvar.current) {
      console.log('[Configuracoes] Toque ignorado: gravação em andamento');
      return;
    }
    travaSalvar.current = true;
    setSalvando(true);

    try {
      const resultado = await preferencias.salvarPreferencias({ nomeLoja, tema });

      if (!resultado.ok) {
        console.log('[Configuracoes] Erro:', resultado.erro);
        setErro(resultado.erro);
        return;
      }

      console.log('[Configuracoes] Preferências salvas:', { nomeLoja, tema });
      Alert.alert('Configurações salvas', 'O nome da loja e o tema foram atualizados.');
    } finally {
      travaSalvar.current = false;
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={estilos.raiz} keyboardShouldPersistTaps="handled">
      <View style={estilos.conteudo}>
        <Text style={estilos.rotulo}>Nome da loja</Text>
        <TextInput
          style={estilos.campo}
          value={nomeLoja}
          onChangeText={(t) => {
            setNomeLoja(t);
            setErro('');
          }}
          placeholder="Ex.: Padaria do Bairro"
          placeholderTextColor={cores.textoSuave}
        />

        <Text style={estilos.rotulo}>Tema</Text>
        <View style={estilos.opcoes}>
          {OPCOES_TEMA.map((opcao) => {
            const selecionado = opcao.valor === tema;
            return (
              <Pressable
                key={opcao.valor}
                style={[estilos.opcao, selecionado && estilos.opcaoSelecionada]}
                onPress={() => setTema(opcao.valor)}
              >
                <Text style={[estilos.opcaoTexto, selecionado && estilos.opcaoTextoSelecionado]}>
                  {opcao.rotulo}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

        <View style={estilos.botoes}>
          <Button
            title={salvando ? 'Salvando…' : 'Salvar'}
            color={cores.botao}
            onPress={salvar}
            disabled={salvando}
          />
        </View>
      </View>
    </ScrollView>
  );
}
