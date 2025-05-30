const express = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=[Items]
    try {
        const result = await mongodb.getDatabase().db().collection('items').find();
        const items = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving items" });
    }
};

const getSingle = async (req, res, next) => {
    //#swagger.tags=[Items]
    try {
        const itemId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("items").findOne({ _id: itemId });

        if (!result) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

const createItem = async (req, res) => {
    //#swagger.tags=[Items]
    const item = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
    };
    const response = await mongodb.getDatabase().db().collection('items').insertOne(item);
    if (response.acknowledged) {
        res.status(201).json(item);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while creating the item.' );
    }
};

const updateItem = async (req, res) => {
    //#swagger.tags=[Items]
    const itemId = new ObjectId(req.params.id);
    const item = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
    };
    const response = await mongodb.getDatabase().db().collection('items').replaceOne({ _id: itemId}, item);
    if (response.modifiedCount > 0) {
        res.status(200).json(updateItem);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while updating the item.' );
    }
};

const deleteItem = async (req, res) => {
    //#swagger.tags=[Items]
    const itemId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('items').deleteOne({ _id: itemId});
    if (response.deletedCount > 0) {
        res.status(204).send();
    }
    else {
        res.status(500).json(response.error || 'Some error occured while deleting the contact.' );
    }
};

module.exports = {
    getAll,
    getSingle,
    createItem,
    updateItem,
    deleteItem,
};