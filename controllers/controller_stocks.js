const utilities = require('../utilities/utilities')
const SI = require('nodejs-stock-info')
let stockInfo = new SI()    

const getStockInfo = (req,res) => {

    stockInfo.setStocks("tsla").getStockInfo().then((response) => {
        console.log(response)
    })

}



exports.getStockInfo = getStockInfo;