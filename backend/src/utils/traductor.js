const axios = require('axios');

async function traducirATextoES(texto) {
  try {
    const res = await axios.post(
      'https://translate.googleapis.com/translate_a/single',
      null,
      {
        params: {
          client: 'gtx',
          sl: 'en',
          tl: 'es',
          dt: 't',
          q: texto
        }
      }
    );

    return res.data[0][0][0];
  } catch (error) {
    console.error('Error traduciendo:', texto);
    return texto;
  }
}

module.exports = { traducirATextoES };