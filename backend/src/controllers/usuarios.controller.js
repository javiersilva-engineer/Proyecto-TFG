const Usuario = require('../models/usuario');
const { calcularObjetivos } = require('../utils/calcularMacros');

exports.crearUsuario = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    res.json({
      message: 'Login correcto',
      usuario: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        email: usuario.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


/*
CALCULAR OBJETIVOS DE UN USUARIO
*/
exports.calcularObjetivosUsuario = async (req, res) => {
  try {

    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    // calcular macros
    const objetivos = calcularObjetivos(usuario);

    // actualizar usuario
    usuario.caloriasObjetivo = objetivos.caloriasObjetivo;
    usuario.proteinasObjetivo = objetivos.proteinasObjetivo;
    usuario.carbohidratosObjetivo = objetivos.carbohidratosObjetivo;
    usuario.grasasObjetivo = objetivos.grasasObjetivo;

    await usuario.save();

    res.json({
      message: "Objetivos calculados correctamente",
      usuario
    });

  } catch (error) {
    res.status(500).json({
      message: "Error calculando objetivos",
      error: error.message
    });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado',
      usuario
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error actualizando usuario',
      error: error.message
    });
  }
};