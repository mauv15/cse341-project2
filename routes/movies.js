const express = require('express');
const router = express.Router();

const moviesController = require('../controllers/movies');
const { isAuthenticated } = require('../middleware/authenticate');

// contenido aqui
// GET /movies – List all movies
router.get('/', moviesController.getAll);

// GET /movies/:id – Get one movie
router.get('/:id', moviesController.getSingle);

// POST /movies – Create new movie
router.post('/', isAuthenticated, moviesController.createMovie);

// PUT /movies/:id – Update movie
router.put('/:id', isAuthenticated, moviesController.updateMovie);

// DELETE /movies/:id – Delete movie
router.delete('/:id', isAuthenticated, moviesController.deleteMovie);

module.exports = router;