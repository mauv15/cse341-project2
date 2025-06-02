const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    // #swagger.tags=['directors']
    try{
        const result = await mongodb.getDatabase().db().collection('directors').find();
        const directors = await result.toArray();
        res.setHeader('content-type', 'application/json');
        res.status(200).json(directors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    // #swagger.tags=['directors']
    try{
       const directorId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('directors').find({ _id: directorId });
        result.toArray().then((directors) => {
            if(directors.length > 0) {
                res.setHeader('content-type', 'application/json');
            res.status(200).json(directors[0]);
            }
            else{
                res.status(404).json({ message: 'director not found' });
            }
        }); 
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
};

const createdirector = async (req, res) => {
    // #swagger.tags=['directors']
    const { name, brithyear} = req.body;
    if (!name || !brithyear) {
        return res.status(400).json({ error: 'name and brithyear are required fields.' });
    }
    
    const director = {
        name: req.body.name,
        brithyear: req.body.brithyear,
        numAwards: req.body.numAwards
    };

    try {
        const response = await mongodb.getDatabase().db().collection('directors').insertOne(director);
        if (response.acknowledged) {
            res.status(201).json({ message: 'director created', id: response.insertedId });
        }
        res.status(500).json({ error: 'Some error occurred while creating the director.' });
    } catch (err) {
        res.status(500).json({ error:EvalError.message });
    }
};

const updatedirector = async (req, res) => {
    // #swagger.tags=['directors']
    let directorId;
    try {
        directorId = new ObjectId(req.params.id);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    const { name, brithyear} = req.body;
    if (!name || !brithyear) {
        return res.status(400).json({ error: 'name and brithyear are required fields.' });
    }

    const director = {
        name: req.body.name,
        brithyear: req.body.brithyear,
        numAwards: req.body.numAwards
    };
    try{
        const response = await mongodb.getDatabase().db().collection('directors').replaceOne({ _id: directorId}, director);
            if (response.modifiedCount > 0) {
                return res.status(200).json({message: 'director updated' });
            }
            res.status(404).json({ error: 'director not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletedirector = async (req, res) => {
    // #swagger.tags=['directors']
    let directorId;
    try{
        directorId = new ObjectId(req.params.id);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try{
        const response = await mongodb.getDatabase().db().collection('directors').deleteOne({ _id: directorId});
        if (response.deletedCount > 0) {
            return res.status(204).json({ message: 'director deleted' });
        }
        res.status(404).json({ error: 'director not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createdirector,
    updatedirector,
    deletedirector
};