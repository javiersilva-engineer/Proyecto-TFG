const axios = require('axios');
const traduccionesManual = require('./traduccionesManual');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function traducirATextoES(texto, reintentos = 2) {
  try {
    if (!texto || typeof texto !== 'string' || !texto.trim()) {
      return '';
    }

    const textoLimpio = texto.trim();
    const clave = textoLimpio.toLowerCase();

    if (traduccionesManual[clave]) {
      return traduccionesManual[clave];
    }

    const res = await axios.get(
      'https://translate.googleapis.com/translate_a/single',
      {
        params: {
          client: 'gtx',
          sl: 'en',
          tl: 'es',
          dt: 't',
          q: textoLimpio
        },
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    const partes = res.data?.[0];

    if (!Array.isArray(partes)) {
      return textoLimpio;
    }

    const traduccionCompleta = partes
      .map(parte => parte?.[0] || '')
      .join('')
      .trim();

    return traduccionCompleta || textoLimpio;
  } catch (error) {
    const status = error.response?.status;
    const mensaje = error.response?.statusText || error.message;

    console.error(`Error traduciendo "${texto}" -> ${status || ''} ${mensaje}`);

    // Si es rate limit, no insistas 4 veces seguidas
    if (status === 429) {
      return texto;
    }

    if (reintentos > 0) {
      await sleep(3000);
      return traducirATextoES(texto, reintentos - 1);
    }

    return texto;
  }
}

module.exports = { traducirATextoES };