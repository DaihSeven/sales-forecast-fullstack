// Testa o model de preferências com o AsyncStorage falso que a própria
// biblioteca fornece para testes (guarda tudo na memória).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { lerPreferencias, salvarPreferencias, PREFERENCIAS_PADRAO } from '../preferenciasModel';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('lerPreferencias', () => {
  test('sem nada salvo, devolve o padrão', async () => {
    await expect(lerPreferencias()).resolves.toEqual(PREFERENCIAS_PADRAO);
  });

  test('devolve o que foi salvo', async () => {
    await salvarPreferencias({ nomeLoja: 'Mercadinho da Ana', tema: 'escuro' });
    await expect(lerPreferencias()).resolves.toEqual({
      nomeLoja: 'Mercadinho da Ana',
      tema: 'escuro',
    });
  });

  test('completa com o padrão o que faltar', async () => {
    await AsyncStorage.setItem('@loja:preferencias', JSON.stringify({ tema: 'escuro' }));
    await expect(lerPreferencias()).resolves.toEqual({
      nomeLoja: PREFERENCIAS_PADRAO.nomeLoja,
      tema: 'escuro',
    });
  });

  test('texto corrompido volta para o padrão', async () => {
    await AsyncStorage.setItem('@loja:preferencias', '{isso não é JSON');
    await expect(lerPreferencias()).resolves.toEqual(PREFERENCIAS_PADRAO);
  });
});
