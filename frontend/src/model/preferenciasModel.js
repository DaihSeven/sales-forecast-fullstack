// Model de preferências — guarda o nome da loja e o tema no AsyncStorage
// (armazenamento simples de chave e valor, bom para configurações pequenas).

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PREFERENCIAS = '@loja:preferencias';

export const PREFERENCIAS_PADRAO = { nomeLoja: 'Padaria do Bairro', tema: 'claro' };

// Devolve as preferências salvas, completando com o padrão o que faltar.
// Se nada foi salvo ou o texto estiver corrompido, devolve o padrão.
export async function lerPreferencias() {
  const texto = await AsyncStorage.getItem(CHAVE_PREFERENCIAS);
  if (!texto) {
    return { ...PREFERENCIAS_PADRAO };
  }
  try {
    return { ...PREFERENCIAS_PADRAO, ...JSON.parse(texto) };
  } catch (erro) {
    console.log('[Model] Preferências corrompidas, usando o padrão:', erro);
    return { ...PREFERENCIAS_PADRAO };
  }
}

export async function salvarPreferencias({ nomeLoja, tema }) {
  await AsyncStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify({ nomeLoja, tema }));
  console.log('[Model] Preferências salvas:', { nomeLoja, tema });
}
