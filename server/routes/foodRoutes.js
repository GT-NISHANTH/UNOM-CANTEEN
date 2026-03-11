const express = require("express");
const router = express.Router();

const Food = require("../models/Food");


// ADD FOOD
router.post("/", async (req, res) => {
    try {

        const food = new Food(req.body);

        await food.save();

        res.json(food);

    } catch (error) {
        res.status(500).json(error);
    }
});


// GET ALL FOOD
router.get("/", async (req, res) => {

    const foods = await Food.find();

    res.json(foods);

});


// UPDATE FOOD
router.put("/:id", async (req, res) => {

    const food = await Food.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(food);

});


// DELETE FOOD
router.delete("/:id", async (req, res) => {

    await Food.findByIdAndDelete(req.params.id);

    res.json({ message: "Food deleted" });

});

module.exports = router;
