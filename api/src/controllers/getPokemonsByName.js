const { Op } = require("sequelize");
const { Pokemon, Type } = require("../db");
const axios = require("axios");

const getPokemonByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    console.log(name);
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 12;
    const offset = limit * (page - 1);

    // Buscamos los pokemones en la base de datos que coincidan con la cadena de texto
    const allPokemonbyName = [];
    const pokemonsInDb = await Pokemon.findAll({
      where: {
        name: {
          [Op.like]: `%${name.toLowerCase()}%`,
        },
      },
      include: Type,
      limit,
      offset,
    });

    // Guardamos los pokemones encontrados en la base de datos
    pokemonsInDb.forEach((pokemon) => {
      allPokemonbyName.push(pokemon);
    });
    console.log("pokemonsInDb", pokemonsInDb)
    // Si la lista de pokemones encontrados en la base de datos es menor al limite de pokemones por pagina
    // Buscamos los pokemones en la API
    if (pokemonsInDb.length === 0) {
      let pokemonFromApi;

      // Buscamos el pokemon en la API
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      );
      pokemonFromApi = response.data;

      // Transformamos el pokemon de la API al mismo formato que los de la base de datos
      const pokemonApi = {
        id_api: pokemonFromApi.id,
        name: pokemonFromApi.name,
        hp: pokemonFromApi.stats[0].base_stat,
        attack: pokemonFromApi.stats[1].base_stat,
        defense: pokemonFromApi.stats[2].base_stat,
        speed: pokemonFromApi.stats[5].base_stat,
        height: pokemonFromApi.height,
        weight: pokemonFromApi.weight,
        image: pokemonFromApi.sprites.other["official-artwork"].front_default,
        createdInDb: false,
        types: pokemonFromApi.types.map((type) => {
          return { name: type.type.name };
        }),
      };
      console.log("first4");
      // Guardamos el pokemon de la API en la lista de pokemones encontrados
      allPokemonbyName.push(pokemonApi);
    }
    // Retornamos la lista de pokemones encontrados en la base de datos y el pokemon de la API
    console.log("allPokemonbyName2", allPokemonbyName);
    return res.json(allPokemonbyName);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      msg: "Error al buscar pokemones por nombre",
      error: error.message,
    });
  }
};

module.exports = {
  getPokemonByName,
};
