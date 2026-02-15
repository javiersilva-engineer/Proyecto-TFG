const Usuario = require('../models/usuario');

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
}

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // ⚠️ Por ahora comparación directa (luego lo haremos con bcrypt)
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