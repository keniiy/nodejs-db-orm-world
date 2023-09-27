const express = require("express");
const joi = require("@hapi/joi");
const { insertItem, getItem, getItems, updateQuantityOrName } = require("./db");

const postItemSchema = joi.object().keys({
    name: joi.string().required(),
    quantity: joi.number().default(0)
});

const putItemSchema = joi.object().keys({
    id: joi.string().required(),
    name: joi.string(),
    quantity: joi.number(),
}).or('quantity', 'name')

const getItemSchema = joi.object().keys({
    id: joi.string().required(),
})


const router = express.Router();

router.post("/item", async (req, res) => {
    try {
        const { body } = req;

        const validateRequest = await postItemSchema.validate(body);

        if (validateRequest.error) {
            res.status(400).end()
        }

        insertItem(body).then((data) => {
            res.status(201).json(data).end()
        }).catch(err => {
            res.status(500).end
        })
    } catch (e) {
        console.log(`Post Item Error ${e.message}`);
        res.status(500).end()
    }
})

router.get("/item/:id", async (req, res) => {
    try {
        const { params: { id } } = req;

        const validateRequest = await getItemSchema.validate({ id });

        if (validateRequest.error) {
            res.status(400).end()
        }

        getItem(id).then((data) => {
            res.status(200).json(data).end()
        }).catch(err => {
            res.status(500).end
        })
    } catch (e) {
        console.log(`Post Item Error ${e.message}`);
        res.status(500).end()
    }
})

router.get("/items", (req, res) => {
    try {
        getItems().then((data) => {
            res.status(200).json(data).end()
        }).catch(e => {
            res.status(500).end()
        })
    } catch (e) {
        console.log(`Get Items Error ${e.message}`);
        res.status(500).end()
    }
})

router.put("/item/:id", async (req, res) => {
    try {
        const { params: { id }, body } = req

        const validateRequest = await putItemSchema.validate({ ...body, id })

        console.log(validateRequest);

        if (validateRequest.error) {
            res.status(400).end()
        }
        console.log('passed here');

        updateQuantityOrName(id, body)
            .then((data) => {
                console.log(data);
                res.status(200).json(data).end()
            }).catch(e => {
                res.status(500).end()
            })
    } catch (e) {
        console.log(`Get Items Error ${e.message}`);
        res.status(500).end()
    }
})


module.exports = router