function validatePokemonData(req, res, next) {
  const { name, hp, attack, defense, speed, height, weight, types } = req.body;

  // Verificamos que el nombre del Pokemon esté presente
  if (!name) {
    return res.status(400).json({ error: 'El nombre del Pokemon es requerido' });
  }

  // Verificamos que se hayan seleccionado al menos dos tipos
  if (!types || types.length < 2) {
    return res.status(400).json({ error: 'Debe seleccionar al menos dos tipos para el Pokemon' });
  }

  // Verificamos que los tipos sean un array
  if (!Array.isArray(types)) {
    return res.status(400).json({ error: 'Los tipos deben ser un array' });
  }

  // Verificamos que los tipos no estén vacíos
  if (types.length === 0) {
    return res.status(400).json({ error: 'Debe seleccionar al menos un tipo para el Pokemon' });
  }

  // Si todo está bien, pasamos al siguiente middleware
  next();
}

module.exports = {
  validatePokemonData
};
