const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    // #swagger.tags=['movies']
    try{
        const result = await mongodb.getDatabase().db().collection('movies').find();
        const movies = await result.toArray();
        res.setHeader('content-type', 'application/json');
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    // #swagger.tags=['movies']
    try{
       const movieId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('movies').find({ _id: movieId });
        result.toArray().then((movies) => {
            if(movies.length > 0) {
                res.setHeader('content-type', 'application/json');
            res.status(200).json(movies[0]);
            }
            else{
                res.status(404).json({ message: 'Movie not found' });
            }
        }); 
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
};

const createMovie = async (req, res) => {
    // #swagger.tags=['movies']
    const { title, year, director } = req.body;
    if (!title || !year || !director) {
        return res.status(400).json({ error: 'Title, year, and director are required fields.' });
    }
    
    const movie = {
        title: req.body.title,
        year: req.body.year,
        director: req.body.director,
        genre: req.body.genre,
        length: req.body.length,
        rated: req.body.rated,
        cast: req.body.cast
    };

    try {
        const response = await mongodb.getDatabase().db().collection('movies').insertOne(movie);
        if (response.acknowledged) {
            res.status(201).json({ message: 'movie created', id: response.insertedId });
        }
        res.status(500).json({ error: 'Some error occurred while creating the movie.' });
    } catch (err) {
        res.status(500).json({ error:EvalError.message });
    }
};

const updateMovie = async (req, res) => {
    // #swagger.tags=['movies']
    let movieId;
    try {
        movieId = new ObjectId(req.params.id);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    const { title, year, director } = req.body;
    if (!title || !year || !director) {
        return res.status(400).json({ error: 'Title, year, and director are required fields.' });
    }

    const movie = {
        title: req.body.title,
        year: req.body.year,
        director: req.body.director,
        genre: req.body.genre,
        length: req.body.length,
        rated: req.body.rated,
        cast: req.body.cast
    };
    try{
        const response = await mongodb.getDatabase().db().collection('movies').replaceOne({ _id: movieId}, movie);
            if (response.modifiedCount > 0) {
                return res.status(200).json({message: 'movie updated' });
            }
            res.status(404).json({ error: 'Movie not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    // #swagger.tags=['movies']
    try{
        const movieId = new ObjectId(req.params.id);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try{
        const response = await mongodb.getDatabase().db().collection('movies').deleteOne({ _id: movieId});
        if (response.deletedCount > 0) {
            return res.status(204).json({ message: 'movie deleted' });
        }
        res.status(404).json({ error: 'Movie not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createMovie,
    updateMovie,
    deleteMovie
};