const express = require('express')
const router = express.Router();
const controller = require('../controllers/controller_stocks')
const {
    validationResult,
    body
} = require('express-validator')


router.get("/stock-info/:stockId", function (req, res) {
    controller.getStockInfo(req, res);
})


module.exports = router