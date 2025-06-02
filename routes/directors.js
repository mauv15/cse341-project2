const express = require('express');
const router = express.Router();

const directorsController = require('../controllers/directors');

// contenido aqui
// GET /directors – List all directors
router.get('/', directorsController.getAll);

// GET /directors/:id – Get one director
router.get('/:id', directorsController.getSingle);

// POST /directors – Create new director
router.post('/', directorsController.createdirector);

// PUT /directors/:id – Update director
router.put('/:id', directorsController.updatedirector);

// DELETE /directors/:id – Delete director
router.delete('/:id', directorsController.deletedirector);

module.exports = router;