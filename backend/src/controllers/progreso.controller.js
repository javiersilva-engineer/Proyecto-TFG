const ProgresoDiario = require('../models/progresoDiario');
const Comida = require('../models/comida');

async function recalcularTotales(progreso) {
  const comidas = await Comida.find({
    _id: { $in: progreso.comidasHechas }
  });

  progreso.caloriasConsumidas = comidas.reduce((acc, c) => acc + (c.calorias || 0), 0);
  progreso.proteinasConsumidas = comidas.reduce((acc, c) => acc + (c.proteinas || 0), 0);
  progreso.carbohidratosConsumidos = comidas.reduce((acc, c) => acc + (c.carbohidratos || 0), 0);
  progreso.grasasConsumidas = comidas.reduce((acc, c) => acc + (c.grasas || 0), 0);
}

exports.obtenerProgresoDiario = async (req, res) => {
  try {
    const { usuarioId, fecha } = req.params;

    let progreso = await ProgresoDiario.findOne({
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
      progreso = await ProgresoDiario.create({
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