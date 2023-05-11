const { Pokemon, Type } = require('../db');
const axios = require('axios');

const getTypesFromAPI = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/type');
  const results = response.data.results;
  const types = results.map((result, index) => {
    return { id: index + 1, name: result.name };
  });
  return types;
};

const typesController = {
  getAllTypes: async (req, res) => {
    try {
      const types = await Type.findAll();
      if (types.length === 0) {
        const typesFromAPI = await getTypesFromAPI();
        await Type.bulkCreate(typesFromAPI);
        return res.status(200).json(typesFromAPI);
      }
      return res.status(200).json(types);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving types' });
    }
  },
};

module.exports = typesController;
