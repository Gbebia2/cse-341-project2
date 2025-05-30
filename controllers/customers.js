const express = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=[customers]
    try {
        const result = await mongodb.getDatabase().db().collection('customers').find();
        const customers = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving customers" });
    }
};

const getSingle = async (req, res, next) => {
    //#swagger.tags=[customers]
    try {
        const customerId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("customers").findOne({ _id: customerId });

        if (!result) {
            return res.status(404).json({ error: "customer not found" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

const createCustomer = async (req, res) => {
    //#swagger.tags=[customers]
    const customer = {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        occupation: req.body.occupation,
        itemBought: req.body.itemBought,
    };
    const response = await mongodb.getDatabase().db().collection('customers').insertOne(customer);
    if (response.acknowledged) {
        res.status(201).json(customer);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while creating the customer.' );
    }
};

const updateCustomer = async (req, res) => {
    //#swagger.tags=[customers]
    const customerId = new ObjectId(req.params.id);
    const customer = {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        occupation: req.body.occupation,
        itemBought: req.body.itemBought,
    };
    const response = await mongodb.getDatabase().db().collection('customers').replaceOne({ _id: customerId}, customer);
    if (response.modifiedCount > 0) {
        res.status(200).json(updateCustomer);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while updating the customer.' );
    }
};

const deleteCustomer = async (req, res) => {
    //#swagger.tags=[customers]
    const customerId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('customers').deleteOne({ _id: customerId});
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
    createCustomer,
    updateCustomer,
    deleteCustomer,
};