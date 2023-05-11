const { Op } = require('sequelize');
const axios = require('axios');
const { Pokemon, Type } = require('../db');

const getPokemonsFromApi = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
  return response.data.results;
};

const getPokemonDetailsFromApi = async (pokemonUrl) => {
  const response = await axios.get(pokemonUrl);
  return {
    id_api: response.data.id,
    name: response.data.name,
    hp: response.data.stats.find((stat) => stat.stat.name === 'hp').base_stat,
    attack: response.data.stats.find((stat) => stat.stat.name === 'attack').base_stat,
    defense: response.data.stats.find((stat) => stat.stat.name === 'defense').base_stat,
    speed: response.data.stats.find((stat) => stat.stat.name === 'speed').base_stat,
    height: response.data.height,
    weight: response.data.weight,
    image: response.data.sprites.other['official-artwork'].front_default,
  };
};

const getPokemonTypesFromApi = async (pokemonUrl) => {
  const response = await axios.get(pokemonUrl);
  return response.data.types.map((type) => type.type.name);
};



const getPokemons = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get pokemons from DB
    const dbPokemons = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
      limit,
      offset,
    });

    // Get pokemons from API
    const apiPokemons = await getPokemonsFromApi();
    const promises = apiPokemons.slice(offset, offset + limit).map(async (pokemon) => {
      const details = await getPokemonDetailsFromApi(pokemon.url);
      const types = await getPokemonTypesFromApi(pokemon.url);
      return {
        ...details,
        types,
        createdInDb: false,
      };
    });
    const apiPokemonsWithDetails = await Promise.all(promises);

    // Merge results
    const mergedPokemons = [...dbPokemons, ...apiPokemonsWithDetails];

    // Sort by name
    mergedPokemons.sort((a, b) => (a.name > b.name ? 1 : -1));
    res.json(mergedPokemons);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving pokemons',
      mss: error.message
    });
  }
};

module.exports = {
  getPokemons,
};
