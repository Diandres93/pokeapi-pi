const { Pokemon, Type } = require('../db.js');

async function createPokemon(req, res) {
  const {
    name,
    hp,
    attack,
    defense,
    speed,
    height,
    weight,
    image,
    types,
  } = req.body;
  console.log("types", types)

  try {
    const pokemon = await Pokemon.create({
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      image,
    });

    const typesFound = await Type.findAll({
      where: { name: types },
    });
    console.log("typesFound", typesFound)
    await pokemon.addTypes(typesFound);

    const pokemonCreated = await Pokemon.findOne({
      where: { id_db: pokemon.id_db },
      include: { model: Type, attributes: ['name'], through: { attributes: [] 
      }, },
    });
    console.log("pokemonCreated", pokemonCreated)

  

    return res.status(201).json({ pokemonCreated });
  } catch (error) {
    res.status(400).json({ message: 'Error creating Pokemon', err: error.message });
  }
}

module.exports = { createPokemon };
