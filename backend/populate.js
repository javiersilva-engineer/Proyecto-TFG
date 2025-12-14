const { poblarRecetas } = require('./spoonacular');

(async () => {
  try {
    await poblarRecetas(10);
    console.log('¡Base de datos poblada con Spoonacular!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
