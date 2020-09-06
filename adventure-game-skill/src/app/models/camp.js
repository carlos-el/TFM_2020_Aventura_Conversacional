const CampLevel = require("./campLevel.js");

module.exports = class Camp {
    constructor(data) {
        this.relevantLevels = {
            2: new CampLevel({
                levelActionTaken: function (game) {
                    game.map.locations[game.map.currentLocation].objects["hook"] = false;
                    return "";
                },
                speech: "Por subir el campamento al nivel 2 puedo darte un objeto bastante útil, un gancho. Seguro que juntandolo con algo más le encuentras utilidad. Que no se te olvide cogerlo antes de irte.",
            }),
            3: new CampLevel({
                levelActionTaken: function (game) {
                    game.inventory.size += 1;
                    return "";
                },
                speech: "Por subir el campamento al nivel tres te daré un módulo para que puedas llevar un objeto más en tu mochila.",
            }),
            9: new CampLevel({
                levelActionTaken: function (game) {
                    game.map.locations[game.map.currentLocation].objects["trapVerySmall_1_01h"] = false;
                    return "";
                },
                speech: "Por subir el campamento al nivel 9 te daré una botella de pesca. Si encuentras el lugar adecuado te servirá para atrapar peces muy fácilmente. Que no se te olvide cogerla antes de irte.",
            }),
            12: new CampLevel({
                levelActionTaken: function (game) {
                    game.resources.food += 60;
                    game.resources.water += 60;
                    game.resources.junk += 60;
                    return "";
                },
                speech: "Vaya, es fantástico. Últimamente todo ha ido sobre ruedas y hemos conseguido manterne el campamento bastante bien. El resto de exploradores también han traido muchos recursos así que nos han sobrado bastantes. Gracias a todo eso, por subir el campamento al nivel 12 te daré todos los recursos que han sobrado.",
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
            return ((40 - quantity) % 15)
        } else if (quantity < 161) { // 3 levels at cost 20
            return ((100 - quantity) % 20)
        } else if (quantity < 215) { // 2 levels at cost 27
            return ((160 - quantity) % 27)
        } else if (quantity < 289) { // 2 levels at cost 37  // with 288 pack u have reached lvl 15
            return ((214 - quantity) % 37)
        } else if (quantity < 409) { // 2 levels at cost 60 
            return ((288 - quantity) % 60)
        } else { // the rest at cost 100
            return ((408 - quantity) % 100)
        }       
    }
}