const { Router } = require('express');
const { Op } = require('sequelize');
const { getPokemons } = require('../controllers/getPokemons');
const { getPokemonById } = require('../controllers/getPokemonById');
const { getPokemonByName } = require('../controllers/getPokemonsByName');
const { createPokemon } = require('../controllers/createPokemon');
const { validatePokemonData } = require('../middleware/validatePokemonData');

const router = Router();

router.get('/', getPokemons)
router.get('/name', getPokemonByName)
router.get('/:id', getPokemonById)

router.post('/', validatePokemonData, createPokemon);


module.exports = router;