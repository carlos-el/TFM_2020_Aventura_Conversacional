const Npc = require("./npc.js");
const NpcState = require("./npcState.js");
const Merchant = require("./merchant.js");
const MerchantState = require("./merchantState.js");

module.exports = class NpcCollection {
    constructor(data) {
        this.npcs = {
            sandra: new Npc({
                names: ["sandra"],
                voice: "Conchita",
                states: {
                    1: new NpcState({
                        mentionQuote: ", quizás debería hablar con ella",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true
                            // set next state for Sandra and delete her from the location.
                            game.npcs["sandra"] = 2;
                            delete game.map.locations[game.map.currentLocation].npcs["sandra"]
                            // If we have already discovered the next location (in our case the camp) put sandra there.
                            if (game.map.locations["camp"]) {
                                game.map.locations["camp"].npcs["sandra"] = false;
                            }
                            // If not, leave the rest to the npc() function in map.js.
                            return "";
                        },
                        speech: "Ya era hora, parece que has espabilado. Vamos al campamento, no deberíamos demorarnos más. Te espero allí",
                    }),
                    2: new NpcState({
                        mentionQuote: " esperándome como dijo",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true
                            return "";
                        },
                        speech: "Bien, ya estamos aquí. Sigamos con nuestras tareas",
                    }),
                },
                merchant: null,
            }),
            takumi: new Npc({
                names: ["takumi", "mercader"],
                voice: "Enrique",
                states: {
                    1: new NpcState({
                        mentionQuote: ", el mercader del campamento. Tal vez pueda comprarle algo de utilidad",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            //Set the merchant state to 1
                            game.merchants["takumi"] = { state: 1, bought: {} };

                            // Set next state and if talking for the first time upgrade players bag
                            game.npcs["takumi"] = 2;
                            if (!alreadyTalked) {
                                game.inventory.size += 1;
                            }
                            return "";
                        },
                        speech: "Hola, ¿qué tal han ido las últimas expediciones? Espero que bien. Tengo una cosa para tí, una accesorio para tu mochila. Te permitirá llevar algún objeto más. Bueno, estaré siempre aquí.",
                    }),
                    2: new NpcState({
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location (in this case it is already true cause we changed state not setting it to false)
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = true
                        },
                        speech: "Hola, ¿qué tal?",
                    }),
                },
                merchant: new Merchant({
                    locations: ["camp"],
                    states: {
                        1: new MerchantState({
                            speech: "Si quieres comprar algo avísame.",
                            goods: {
                                junk: {
                                    units: 20,
                                    maxBought: 2,
                                    price: {
                                        water: 2,
                                        battery_small: 1,
                                    }
                                }
                            }
                        })
                    }
                }),
            }),
        }
    }
}