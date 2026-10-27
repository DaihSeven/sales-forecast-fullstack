// Tema do app: escolhe as cores e os estilos conforme a preferência salva
// (claro ou escuro). Os dois conjuntos são criados uma vez só, aqui em cima,
// e as telas só escolhem qual usar.

import { usePreferencias } from '../controller/PreferenciasController';
import { coresClaro, coresEscuro, criarEstilos } from './estilos';

const temas = {
  claro: { cores: coresClaro, estilos: criarEstilos(coresClaro) },
  escuro: { cores: coresEscuro, estilos: criarEstilos(coresEscuro) },
};

// Uso nas telas: const { cores, estilos } = useTema();
export function useTema() {
  const { tema } = usePreferencias();
  return { tema, ...(temas[tema] ?? temas.claro) };
}
