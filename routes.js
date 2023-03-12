const express = require("express");
const ExpressError = require("./expressError");
const router = new express.Router();
const Item = require("./item");

router.get("/", (req, res) => {
    res.json(Item.getAll());
});

router.get("/:name", (req, res) => {
    const name = req.params.name;
    const item = Item.get(name);
    if (!item) {
        throw new ExpressError("Item not found", 404);
    }
    res.json(item);
});

router.post("/", (req, res) => {
    const {name=null, price=null} = req.body;
    if (!name || !price) {
        throw new ExpressError("name and price required", 400);
    }

    if (isNaN(Number(price))) {
        throw new ExpressError("Invalid price", 400);
    }

    const newItem = new Item(name, price);
    res.json({"added":newItem});
});

router.patch("/:name", (req, res) => {
    const name = req.params.name;
    const {name: itemName=null, price=null} = req.body;

    if (!itemName || !price) {
        throw new ExpressError("name and price required", 400);
    }

    const data = {"name": itemName, "price":price};
    const updated = Item.update(name, data);

    if (!updated) {
        throw new ExpressError("Item not found", 404);
    }

    res.json({"updated":updated});
});

router.delete("/:name", (req, res) => {
    const name = req.params.name;
    const removed = Item.remove(name);
    if (!removed) {
        throw new ExpressError("Item not found", 404);
    }

    res.json({"message":"Deleted"});
});

module.exports = router;