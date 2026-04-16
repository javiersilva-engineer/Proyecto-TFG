const ProgresoDiario = require('../models/progresoDiario');
const Comida = require('../models/comida');
const MenuSemanalUsuario = require('../models/menuSemanalUsuario');

async function recalcularTotales(progreso) {
  const comidas = await Comida.find({
    _id: { $in: progreso.comidasHechas }
  });

  progreso.caloriasConsumidas = comidas.reduce((acc, c) => acc + (c.calorias || 0), 0);
  progreso.proteinasConsumidas = comidas.reduce((acc, c) => acc + (c.proteinas || 0), 0);
  progreso.carbohidratosConsumidos = comidas.reduce((acc, c) => acc + (c.carbohidratos || 0), 0);
  progreso.grasasConsumidas = comidas.reduce((acc, c) => acc + (c.grasas || 0), 0);
}

function obtenerDiaKeyDesdeFecha(fechaString) {
  const fecha = new Date(`${fechaString}T12:00:00`);
  const day = fecha.getDay();

  const mapa = {
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sabado',
    0: 'domingo'
  };

  return mapa[day];
}

function formatearFechaLocal(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function contarComidasDelMenu(menuDia) {
  if (!menuDia) return 0;

  return ['desayuno', 'comida', 'snack', 'cena']
    .filter(tipo => !!menuDia[tipo])
    .length;
}

exports.obtenerProgresoDiario = async (req, res) => {
  try {
    const { usuarioId, fecha } = req.params;

    const progreso = await ProgresoDiario.findOne({
      usuario: usuarioId,
      fecha
    });

    if (!progreso) {
      return res.json({
        usuario: usuarioId,
        fecha,
        comidasHechas: [],
        caloriasConsumidas: 0,
        proteinasConsumidas: 0,
        carbohidratosConsumidos: 0,
        grasasConsumidas: 0
      });
    }

    res.json(progreso);

  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo progreso diario',
      error: error.message
    });
  }
};

exports.toggleComidaHecha = async (req, res) => {
  try {
    const { usuarioId, fecha, comidaId } = req.body;

    if (!usuarioId || !fecha || !comidaId) {
      return res.status(400).json({
        message: 'usuarioId, fecha y comidaId son obligatorios'
      });
    }

    let progreso = await ProgresoDiario.findOne({
      usuario: usuarioId,
      fecha
    });

    if (!progreso) {
      progreso = new ProgresoDiario({
        usuario: usuarioId,
        fecha,
        comidasHechas: []
      });
    }

    const yaExiste = progreso.comidasHechas.some(
      id => id.toString() === comidaId
    );

    if (yaExiste) {
      progreso.comidasHechas = progreso.comidasHechas.filter(
        id => id.toString() !== comidaId
      );
    } else {
      progreso.comidasHechas.push(comidaId);
    }

    await recalcularTotales(progreso);
    await progreso.save();

    res.json({
      message: 'Progreso actualizado correctamente',
      progreso
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error actualizando progreso diario',
      error: error.message
    });
  }
};

exports.obtenerRacha = async (req, res) => {
  try {
    const { usuarioId, fecha } = req.params;

    const menu = await MenuSemanalUsuario.findOne({ usuario: usuarioId });

    if (!menu) {
      return res.json({ racha: 0 });
    }

    let racha = 0;
    let fechaActual = new Date(`${fecha}T12:00:00`);

    while (true) {
      const fechaISO = formatearFechaLocal(fechaActual);
      const diaKey = obtenerDiaKeyDesdeFecha(fechaISO);
      const menuDia = menu[diaKey];

      const totalComidasDia = contarComidasDelMenu(menuDia);

      if (totalComidasDia === 0) {
        break;
      }

      const progreso = await ProgresoDiario.findOne({
        usuario: usuarioId,
        fecha: fechaISO
      });

      const comidasHechas = progreso?.comidasHechas || [];

      if (comidasHechas.length >= totalComidasDia) {
        racha++;
      } else {
        break;
      }

      fechaActual.setDate(fechaActual.getDate() - 1);
    }

    res.json({ racha });

  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo racha',
      error: error.message
    });
  }
};