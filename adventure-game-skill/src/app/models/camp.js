const CampLevel = require("./campLevel.js");

module.exports = class Camp {
    constructor(data) {
        this.relevantLevels = {
            1: new CampLevel({
                levelActionTaken: function (game) {
                    console.log("executing function")
                    game.inventory.size += 1;
                    return "";
                },
                speech: "Por subir el campamento al nivel uno te daré un módulo para que puedas llevar un objeto más en tu mochila.",
            }),
        }
    }

    getRelevantLevel(level){
        if (this.relevantLevels[level]){
            return this.relevantLevels[level];
        }

        return null;
    }

    // The level of the camp is expressed on how many packs the player has given to the camp administrator.
    // Returns the level of the camp based on packs quantity
    getLevelByQuantity(quantityGiven) {
        let quantity = quantityGiven;
        
        if(!quantity){
            quantity = 0
        }

        if (quantity < 41){ // 4 levels at cost 10
            return Math.floor(quantity/10)
        } else if (quantity < 101) { // 4 levels at cost 15
            return Math.floor(4 + ((quantity-40) / 15))
        } else if (quantity < 161) { // 3 levels at cost 20
            return Math.floor(8 + ((quantity-100) / 20))
        } else if (quantity < 215) { // 2 levels at cost 27
            return Math.floor(11 + ((quantity-160) / 27)) 
        } else if (quantity < 289) { // 2 levels at cost 37  // with 288 pack u have reached lvl 15
            return Math.floor(13 + ((quantity-214) / 37)) 
        } else if (quantity < 409) { // 2 levels at cost 60 
            return Math.floor(15 + ((quantity-288) / 60)) 
        } else { // the rest at cost 100
            return Math.floor(17 + ((quantity-408) / 100)) 
        }       
    }

    // Returns how many packs are needed to upgrade the camp to the next level based on the number of packs given.
    // Depends on the cost for the next level.
    getPacksNeededForNextLevel(quantity) {
        if (quantity < 41){ // 4 levels at cost 10
            return 10 - (quantity % 10)
        } else if (quantity < 101) { // 4 levels at cost 15
            return 15 - ((40 - quantity) % 15)
        } else if (quantity < 161) { // 3 levels at cost 20
            return 20 - ((100 - quantity) % 20)
        } else if (quantity < 215) { // 2 levels at cost 27
            return 27 - ((160 - quantity) % 27)
        } else if (quantity < 289) { // 2 levels at cost 37  // with 288 pack u have reached lvl 15
            return 37 - ((214 - quantity) % 37)
        } else if (quantity < 409) { // 2 levels at cost 60 
            return 60 - ((288 - quantity) % 60)
        } else { // the rest at cost 100
            return 100 - ((408 - quantity) % 100)
        }       
    }
}