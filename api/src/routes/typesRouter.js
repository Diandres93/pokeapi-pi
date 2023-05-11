const { Router } = require('express');
const typesRouter = Router();
const typesController = require('../controllers/typesControllers')


typesRouter.get('/', typesController.getAllTypes)

module.exports = typesRouter;