const axios = require('axios');
const { Pokemon, Type } = require('../db');

const getPokemonById = async (req, res, next) => {
  console.log("id")
  try {
    const { id } = req.params;
    console.log(id)
    let pokemon 
    
    if (isNaN(id)) { // si no es un número, es una cadena
      pokemon = await Pokemon.findOne({
        where: { id_db: id },
        include: { model: Type, attributes: ['name'] },
      });
    }

    if (!pokemon) {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);

      pokemon = {
        id_api: data.id,
        name: data.name,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speed: data.stats[5].base_stat,
        height: data.height,
        weight: data.weight,
        image: data.sprites.other['official-artwork'].front_default,
        createdInDb: false,
        types: data.types.map((type) => ({ name: type.type.name })),
      };
    }

    return res.json(pokemon);
  } catch (err) {
    return res.status(500).json({
      message: 'Error retrieving pokemon',
      mess: err.message
    });
  }
};

module.exports = {
  getPokemonById,
};
