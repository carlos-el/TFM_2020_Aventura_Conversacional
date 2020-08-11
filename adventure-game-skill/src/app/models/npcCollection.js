const Npc = require("./npc.js");
const NpcState = require("./npcState.js");

module.exports = class NpcCollection {
    constructor(data) {
        this.npcs = {
            sandra: new Npc({
                name: "sandra",
                voice: "Conchita",
                states: {
                    1: new NpcState({
                        mentionQuote: ", quizás debería hablar con ella",
                        talkActionTaken: function (game, alreadyTalked) {
                            // set next state for Sandra and delete her from the location.
                            game.npcs["sandra"] = 2;
                            delete game.map.locations[game.map.currentLocation].npcs["sandra"]
                            // If we have already discovered the next location (in our case the camp) put sandra there.
                            if (game.map.locations["camp"]){
                                game.map.locations["camp"].npcs["sandra"] = false;
                            }
                            // If not, leave the rest to the npc() function in map.js.
                            return "";
                        },
                        speech: "Ya era hora, parece que has espabilado. Vamos al campamento, no deberíamos demorarnos más. Te espero allí",
                    }),
                    2: new NpcState({
                        mentionQuote: " esperándome como dijo.",
                        talkActionTaken: function (game, alreadyTalked) {
                            return "";
                        },
                        speech: "Bien, ya estamos aquí. Sigamos con nuestras tareas",
                    }),
                }
            }),
        }
    }
}